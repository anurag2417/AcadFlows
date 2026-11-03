import mongoose from 'mongoose';
import { Timetable, TimetableEntry, Room, TimeSlot } from '../../models/Timetable';
import { Subject } from '../../models/Subject';
import { Section } from '../../models/Section';
import { Grade } from '../../models/Grade';
import { Teacher } from '../../models/Teacher';
import { AppError } from '../../middleware/error-handler';
import { attachRefs } from '../../utils/attach-refs';

const timetableEntryRefs = {
  subjectId: { model: Subject, fields: 'name code' },
  teacherId: { model: Teacher, fields: 'firstName lastName employeeId' },
  sectionId: { model: Section, fields: 'name code gradeId' },
  gradeId: { model: Grade, fields: 'name code' },
  roomId: { model: Room, fields: 'name code' },
};

export class TimetableService {
  // ============ Timetable Management ============

  static async createTimetable(tenantId: string, data: any) {
    const timetable = await Timetable.create({
      tenantId,
      ...data,
      entries: [],
    });

    return timetable;
  }

  static async getTimetables(
    tenantId: string,
    filters: {
      academicYearId?: string;
      type?: string;
      isActive?: boolean;
      page?: number;
      limit?: number;
    }
  ) {
    const query: any = { tenantId };

    if (filters.academicYearId) query.academicYearId = filters.academicYearId;
    if (filters.type) query.type = filters.type;
    if (filters.isActive !== undefined) query.isActive = filters.isActive;

    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const skip = (page - 1) * limit;

    const [timetables, total] = await Promise.all([
      Timetable.find(query)
        .populate('createdBy', 'firstName lastName')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Timetable.countDocuments(query),
    ]);

    const items = await Promise.all(
      timetables.map(async timetable => ({
        ...timetable.toObject(),
        entriesCount: await TimetableEntry.countDocuments({
          tenantId,
          timetableId: timetable._id.toString(),
        }),
      })),
    );

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  static async getTimetableById(id: string, tenantId: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError('Invalid timetable ID', 400);
    }

    const timetable = await Timetable.findOne({ _id: id, tenantId })
      .populate('createdBy', 'firstName lastName');

    if (!timetable) {
      throw new AppError('Timetable not found', 404);
    }

    // Attach entries from the separate collection
    const rawEntries = await TimetableEntry.find({ timetableId: id, tenantId })
      .sort({ dayOfWeek: 1, startTime: 1 })
      .lean();
    const entries = await attachRefs(rawEntries, timetableEntryRefs);

    return { ...timetable.toObject(), entries };
  }

  static async updateTimetable(id: string, tenantId: string, data: any) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError('Invalid timetable ID', 400);
    }

    const timetable = await Timetable.findOneAndUpdate(
      { _id: id, tenantId },
      { $set: data },
      { new: true, runValidators: true }
    );

    if (!timetable) {
      throw new AppError('Timetable not found', 404);
    }

    return timetable;
  }

  static async deleteTimetable(id: string, tenantId: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError('Invalid timetable ID', 400);
    }

    // Delete all entries
    await TimetableEntry.deleteMany({ timetableId: id, tenantId });

    const timetable = await Timetable.findOneAndDelete({ _id: id, tenantId });

    if (!timetable) {
      throw new AppError('Timetable not found', 404);
    }

    return timetable;
  }

  // ============ Timetable Entries ============

  static async addEntry(tenantId: string, timetableId: string, data: any) {
    // Check if timetable exists
    const timetable = await Timetable.findOne({ _id: timetableId, tenantId });
    if (!timetable) {
      throw new AppError('Timetable not found', 404);
    }

    // Validate time format
    this.validateTime(data.startTime, data.endTime);
    const [subject, section, grade, teacher, room] = await Promise.all([
      Subject.findOne({ _id: data.subjectId, tenantId }).select('_id'),
      Section.findOne({ _id: data.sectionId, tenantId }).select('_id'),
      Grade.findOne({ _id: data.gradeId, tenantId }).select('_id'),
      Teacher.findOne({ _id: data.teacherId, tenantId, isDeleted: false }).select('_id'),
      data.roomId ? Room.findOne({ _id: data.roomId, tenantId }).select('_id') : null,
    ]);
    if (!subject || !section || !grade || !teacher || (data.roomId && !room)) {
      throw new AppError('Timetable references must belong to the active school', 400);
    }

    // Check for conflicts
    const conflicts = await this.checkConflicts(tenantId, {
      teacherId: data.teacherId,
      sectionId: data.sectionId,
      roomId: data.roomId,
      dayOfWeek: data.dayOfWeek,
      startTime: data.startTime,
      endTime: data.endTime,
      excludeEntryId: data.excludeEntryId,
    });

    if (conflicts.length > 0) {
      throw new AppError(`Conflict detected: ${conflicts.join(', ')}`, 409);
    }

    // FIXED B14: entries live only in TimetableEntry collection.
    const entry = await TimetableEntry.create({
      tenantId,
      timetableId,
      ...data,
    });

    return entry;
  }

  static async updateEntry(tenantId: string, entryId: string, data: any) {
    if (!mongoose.Types.ObjectId.isValid(entryId)) {
      throw new AppError('Invalid entry ID', 400);
    }

    const currentEntry = await TimetableEntry.findOne({ _id: entryId, tenantId }).lean();
    if (!currentEntry) {
      throw new AppError('Timetable entry not found', 404);
    }
    const merged = { ...currentEntry, ...data };
    this.validateTime(merged.startTime, merged.endTime);
    const [subject, section, grade, teacher, room] = await Promise.all([
      Subject.findOne({ _id: merged.subjectId, tenantId }).select('_id'),
      Section.findOne({ _id: merged.sectionId, tenantId }).select('_id'),
      Grade.findOne({ _id: merged.gradeId, tenantId }).select('_id'),
      Teacher.findOne({ _id: merged.teacherId, tenantId, isDeleted: false }).select('_id'),
      merged.roomId ? Room.findOne({ _id: merged.roomId, tenantId }).select('_id') : null,
    ]);
    if (!subject || !section || !grade || !teacher || (merged.roomId && !room)) {
      throw new AppError('Timetable references must belong to the active school', 400);
    }

    // Check for conflicts excluding current entry
    if (data.startTime || data.endTime || data.teacherId || data.sectionId || data.roomId || data.dayOfWeek) {
      const conflicts = await this.checkConflicts(tenantId, {
        teacherId: merged.teacherId,
        sectionId: merged.sectionId,
        roomId: merged.roomId,
        dayOfWeek: merged.dayOfWeek,
        startTime: merged.startTime,
        endTime: merged.endTime,
        excludeEntryId: entryId,
      });

      if (conflicts.length > 0) {
        throw new AppError(`Conflict detected: ${conflicts.join(', ')}`, 409);
      }
    }

    const entry = await TimetableEntry.findOneAndUpdate(
      { _id: entryId, tenantId },
      { $set: data },
      { new: true, runValidators: true }
    );

    if (!entry) {
      throw new AppError('Timetable entry not found', 404);
    }

    return entry;
  }

  static async deleteEntry(entryId: string, tenantId: string) {
    if (!mongoose.Types.ObjectId.isValid(entryId)) {
      throw new AppError('Invalid entry ID', 400);
    }

    const entry = await TimetableEntry.findOneAndDelete({ _id: entryId, tenantId });
    if (!entry) {
      throw new AppError('Timetable entry not found', 404);
    }
    return entry;
  }

  // ============ Conflict Detection ============

  static async checkConflicts(
    tenantId: string,
    data: {
      teacherId?: string;
      sectionId?: string;
      roomId?: string;
      dayOfWeek: string;
      startTime: string;
      endTime: string;
      excludeEntryId?: string;
    }
  ): Promise<string[]> {
    const conflicts: string[] = [];

    // Build query
    const query: any = {
      tenantId,
      dayOfWeek: data.dayOfWeek,
      startTime: { $lt: data.endTime },
      endTime: { $gt: data.startTime },
    };

    if (data.excludeEntryId) {
      query._id = { $ne: data.excludeEntryId };
    }

    // Check teacher conflicts
    if (data.teacherId) {
      const teacherConflicts = await TimetableEntry.find({
        ...query,
        teacherId: data.teacherId,
      }).populate('teacherId', 'firstName lastName');

      if (teacherConflicts.length > 0) {
        const names = teacherConflicts.map((e: any) =>
          e.teacherId?.firstName && e.teacherId?.lastName
            ? `${e.teacherId.firstName} ${e.teacherId.lastName}`
            : 'Unknown Teacher'
        );
        conflicts.push(`Teacher ${names.join(', ')} is already booked at this time`);
      }
    }

    // Check section conflicts
    if (data.sectionId) {
      const sectionConflicts = await TimetableEntry.find({
        ...query,
        sectionId: data.sectionId,
      }).populate('sectionId', 'name');

      if (sectionConflicts.length > 0) {
        const names = sectionConflicts.map((e: any) => e.sectionId?.name || 'Unknown Section');
        conflicts.push(`Section ${names.join(', ')} is already booked at this time`);
      }
    }

    // Check room conflicts
    if (data.roomId) {
      const roomConflicts = await TimetableEntry.find({
        ...query,
        roomId: data.roomId,
      }).populate('roomId', 'name code');

      if (roomConflicts.length > 0) {
        const names = roomConflicts.map((e: any) => e.roomId?.name || e.roomNumber || 'Unknown Room');
        conflicts.push(`Room ${names.join(', ')} is already booked at this time`);
      }
    }

    return conflicts;
  }

  // ============ Timetable Views ============

  private static async getViewEntries(
    tenantId: string,
    filter: Record<string, string>,
    academicYearId?: string,
    startDate?: Date,
    endDate?: Date,
  ) {
    const timetableQuery: any = { tenantId, isActive: true };
    if (academicYearId) timetableQuery.academicYearId = academicYearId;
    if (startDate || endDate) {
      timetableQuery.startDate = { $lte: endDate || new Date() };
      timetableQuery.endDate = { $gte: startDate || new Date(0) };
    }

    const timetables = await Timetable.find(timetableQuery).select('_id').lean();
    if (timetables.length === 0) return this.groupByDay([]);

    const rawEntries = await TimetableEntry.find({
      tenantId,
      ...filter,
      timetableId: { $in: timetables.map(timetable => timetable._id.toString()) },
    })
      .sort({ dayOfWeek: 1, startTime: 1 })
      .lean();
    const entries = await attachRefs(rawEntries, timetableEntryRefs);

    return this.groupByDay(entries);
  }

  static async getSectionTimetable(
    tenantId: string,
    sectionId: string,
    academicYearId?: string,
    startDate?: Date,
    endDate?: Date,
  ) {
    return this.getViewEntries(tenantId, { sectionId }, academicYearId, startDate, endDate);
  }

  static async getTeacherTimetable(
    tenantId: string,
    teacherId: string,
    academicYearId?: string,
    startDate?: Date,
    endDate?: Date,
  ) {
    return this.getViewEntries(tenantId, { teacherId }, academicYearId, startDate, endDate);
  }

  static async getRoomTimetable(
    tenantId: string,
    roomId: string,
    academicYearId?: string,
    startDate?: Date,
    endDate?: Date,
  ) {
    return this.getViewEntries(tenantId, { roomId }, academicYearId, startDate, endDate);
  }

  private static groupByDay(entries: any[]) {
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const grouped: any = {};

    days.forEach(day => {
      grouped[day] = entries.filter(e => e.dayOfWeek === day);
    });

    return grouped;
  }

  // ============ Time Slots ============

  static async createTimeSlot(tenantId: string, data: any) {
    const timeSlot = await TimeSlot.create({
      tenantId,
      ...data,
    });

    return timeSlot;
  }

  static async getTimeSlots(tenantId: string, dayOfWeek?: string) {
    const query: any = { tenantId, isActive: true };
    if (dayOfWeek) query.dayOfWeek = dayOfWeek;

    return await TimeSlot.find(query).sort({ startTime: 1 });
  }

  static async updateTimeSlot(id: string, tenantId: string, data: any) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError('Invalid time slot ID', 400);
    }

    const timeSlot = await TimeSlot.findOneAndUpdate(
      { _id: id, tenantId },
      { $set: data },
      { new: true, runValidators: true }
    );

    if (!timeSlot) {
      throw new AppError('Time slot not found', 404);
    }

    return timeSlot;
  }

  static async deleteTimeSlot(id: string, tenantId: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError('Invalid time slot ID', 400);
    }

    const timeSlot = await TimeSlot.findOneAndDelete({ _id: id, tenantId });
    if (!timeSlot) {
      throw new AppError('Time slot not found', 404);
    }

    return timeSlot;
  }

  // ============ Rooms ============

  static async createRoom(tenantId: string, data: any) {
    const room = await Room.create({
      tenantId,
      ...data,
    });

    return room;
  }

  static async getRooms(
    tenantId: string,
    filters: {
      type?: string;
      isActive?: boolean;
      page?: number;
      limit?: number;
    }
  ) {
    const query: any = { tenantId };

    if (filters.type) query.type = filters.type;
    if (filters.isActive !== undefined) query.isActive = filters.isActive;

    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const skip = (page - 1) * limit;

    const [rooms, total] = await Promise.all([
      Room.find(query)
        .sort({ name: 1 })
        .skip(skip)
        .limit(limit),
      Room.countDocuments(query),
    ]);

    return {
      items: rooms,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  static async getRoomById(id: string, tenantId: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError('Invalid room ID', 400);
    }

    const room = await Room.findOne({ _id: id, tenantId });
    if (!room) {
      throw new AppError('Room not found', 404);
    }

    return room;
  }

  static async updateRoom(id: string, tenantId: string, data: any) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError('Invalid room ID', 400);
    }

    const room = await Room.findOneAndUpdate(
      { _id: id, tenantId },
      { $set: data },
      { new: true, runValidators: true }
    );

    if (!room) {
      throw new AppError('Room not found', 404);
    }

    return room;
  }

  static async deleteRoom(id: string, tenantId: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError('Invalid room ID', 400);
    }

    const room = await Room.findOneAndDelete({ _id: id, tenantId });
    if (!room) {
      throw new AppError('Room not found', 404);
    }

    return room;
  }

  // ============ Helpers ============

  private static validateTime(startTime: string, endTime: string) {
    const start = new Date(`1970-01-01T${startTime}:00`);
    const end = new Date(`1970-01-01T${endTime}:00`);

    if (start >= end) {
      throw new AppError('Start time must be before end time', 400);
    }

    return true;
  }

  static async getTimetableStats(tenantId: string) {
    const totalTimetables = await Timetable.countDocuments({ tenantId });
    const activeTimetables = await Timetable.countDocuments({ tenantId, isActive: true });
    const totalEntries = await TimetableEntry.countDocuments({ tenantId });

    return {
      totalTimetables,
      activeTimetables,
      totalEntries,
    };
  }
}