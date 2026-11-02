import mongoose from 'mongoose';
import { AcademicYear } from '../../models/AcademicYear';
import { Grade } from '../../models/Grade';
import { Section } from '../../models/Section';
import { Subject } from '../../models/Subject';
import { TeacherSubject } from '../../models/TeacherSubject';
import { Schedule } from '../../models/Schedule';
import { AppError } from '../../middleware/error-handler';

// Academic Year Service
export class AcademicYearService {
  static async create(data: any) {
    const academicYear = await AcademicYear.create(data);
    return academicYear;
  }

  static async getAll(tenantId: string) {
    return await AcademicYear.find({ tenantId }).sort({ startDate: -1 });
  }

  static async getById(id: string, tenantId: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError('Invalid ID format', 400);
    }
    const academicYear = await AcademicYear.findOne({ _id: id, tenantId });
    if (!academicYear) {
      throw new AppError('Academic year not found', 404);
    }
    return academicYear;
  }

  static async update(id: string, tenantId: string, data: any) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError('Invalid ID format', 400);
    }
    const academicYear = await AcademicYear.findOneAndUpdate(
      { _id: id, tenantId },
      { $set: data },
      { new: true, runValidators: true }
    );
    if (!academicYear) {
      throw new AppError('Academic year not found', 404);
    }
    return academicYear;
  }

  static async delete(id: string, tenantId: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError('Invalid ID format', 400);
    }
    const academicYear = await AcademicYear.findOneAndDelete({ _id: id, tenantId });
    if (!academicYear) {
      throw new AppError('Academic year not found', 404);
    }
    return academicYear;
  }

  static async setCurrent(id: string, tenantId: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError('Invalid ID format', 400);
    }
    // Remove current flag from all
    await AcademicYear.updateMany({ tenantId }, { $set: { isCurrent: false } });
    // Set current flag for the selected
    const academicYear = await AcademicYear.findOneAndUpdate(
      { _id: id, tenantId },
      { $set: { isCurrent: true } },
      { new: true }
    );
    if (!academicYear) {
      throw new AppError('Academic year not found', 404);
    }
    return academicYear;
  }
}

// Grade Service
export class GradeService {
  static async create(data: any) {
    const grade = await Grade.create(data);
    return grade;
  }

  static async getAll(tenantId: string) {
    return await Grade.find({ tenantId }).sort({ sequence: 1 });
  }

  static async getById(id: string, tenantId: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError('Invalid ID format', 400);
    }
    const grade = await Grade.findOne({ _id: id, tenantId });
    if (!grade) {
      throw new AppError('Grade not found', 404);
    }
    return grade;
  }

  static async update(id: string, tenantId: string, data: any) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError('Invalid ID format', 400);
    }
    const grade = await Grade.findOneAndUpdate(
      { _id: id, tenantId },
      { $set: data },
      { new: true, runValidators: true }
    );
    if (!grade) {
      throw new AppError('Grade not found', 404);
    }
    return grade;
  }

  static async delete(id: string, tenantId: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError('Invalid ID format', 400);
    }
    const grade = await Grade.findOneAndDelete({ _id: id, tenantId });
    if (!grade) {
      throw new AppError('Grade not found', 404);
    }
    return grade;
  }
}

// Section Service
export class SectionService {
  static async create(data: any) {
    if (data.classTeacherId) {
      const existing = await Section.findOne({
        tenantId: data.tenantId,
        classTeacherId: data.classTeacherId,
      });
      if (existing) {
        throw new AppError('This teacher is already the class teacher of another section', 409);
      }
    }
    const section = await Section.create(data);
    return section;
  }

  static async getAll(tenantId: string, gradeId?: string) {
    const filter: any = { tenantId };
    if (gradeId) {
      filter.gradeId = gradeId;
    }
    return await Section.find(filter).sort({ name: 1 });
  }

  static async getById(id: string, tenantId: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError('Invalid ID format', 400);
    }
    const section = await Section.findOne({ _id: id, tenantId });
    if (!section) {
      throw new AppError('Section not found', 404);
    }
    return section;
  }

  static async update(id: string, tenantId: string, data: any) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError('Invalid ID format', 400);
    }
    if (data.classTeacherId) {
      const existing = await Section.findOne({
        tenantId,
        classTeacherId: data.classTeacherId,
        _id: { $ne: id },
      });
      if (existing) {
        throw new AppError('This teacher is already the class teacher of another section', 409);
      }
    }
    const section = await Section.findOneAndUpdate(
      { _id: id, tenantId },
      { $set: data },
      { new: true, runValidators: true }
    );
    if (!section) {
      throw new AppError('Section not found', 404);
    }
    return section;
  }

  static async delete(id: string, tenantId: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError('Invalid ID format', 400);
    }
    const section = await Section.findOneAndDelete({ _id: id, tenantId });
    if (!section) {
      throw new AppError('Section not found', 404);
    }
    return section;
  }
}

// Subject Service
export class SubjectService {
  static async create(data: any) {
    const subject = await Subject.create(data);
    return subject;
  }

  static async getAll(tenantId: string, gradeId?: string) {
    const filter: any = { tenantId };
    if (gradeId) {
      filter.gradeId = gradeId;
    }
    return await Subject.find(filter).sort({ name: 1 });
  }

  static async getById(id: string, tenantId: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError('Invalid ID format', 400);
    }
    const subject = await Subject.findOne({ _id: id, tenantId });
    if (!subject) {
      throw new AppError('Subject not found', 404);
    }
    return subject;
  }

  static async update(id: string, tenantId: string, data: any) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError('Invalid ID format', 400);
    }
    const subject = await Subject.findOneAndUpdate(
      { _id: id, tenantId },
      { $set: data },
      { new: true, runValidators: true }
    );
    if (!subject) {
      throw new AppError('Subject not found', 404);
    }
    return subject;
  }

  static async delete(id: string, tenantId: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError('Invalid ID format', 400);
    }
    const subject = await Subject.findOneAndDelete({ _id: id, tenantId });
    if (!subject) {
      throw new AppError('Subject not found', 404);
    }
    return subject;
  }
}

// Teacher Subject Service
export class TeacherSubjectService {
  static async assign(data: any) {
    const teacherSubject = await TeacherSubject.create(data);
    return await TeacherSubject.findById(teacherSubject._id)
      .populate('teacherId', 'firstName lastName employeeId')
      .populate('subjectId', 'name code')
      .populate('sectionId', 'name');
  }

  static async getAll(tenantId: string, teacherId?: string, subjectId?: string) {
    const filter: any = { tenantId };
    if (teacherId) {
      filter.teacherId = teacherId;
    }
    if (subjectId) {
      filter.subjectId = subjectId;
    }
    return await TeacherSubject.find(filter)
      .populate('teacherId', 'firstName lastName email')
      .populate('subjectId', 'name code')
      .populate('gradeId', 'name code')
      .populate('sectionId', 'name code');
  }

  static async getById(id: string, tenantId: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError('Invalid ID format', 400);
    }
    const teacherSubject = await TeacherSubject.findOne({ _id: id, tenantId })
      .populate('teacherId', 'firstName lastName email')
      .populate('subjectId', 'name code')
      .populate('gradeId', 'name code')
      .populate('sectionId', 'name code');
    if (!teacherSubject) {
      throw new AppError('Assignment not found', 404);
    }
    return teacherSubject;
  }

  static async delete(id: string, tenantId: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError('Invalid ID format', 400);
    }
    const teacherSubject = await TeacherSubject.findOneAndDelete({ _id: id, tenantId });
    if (!teacherSubject) {
      throw new AppError('Assignment not found', 404);
    }
    return teacherSubject;
  }

  static async getByTeacher(teacherId: string, tenantId: string) {
    return await TeacherSubject.find({ teacherId, tenantId })
      .populate('subjectId', 'name code')
      .populate('gradeId', 'name code')
      .populate('sectionId', 'name code');
  }
}

// Schedule Service
export class ScheduleService {
  static async create(data: any) {
    // Check for conflicts
    const conflicts = await Schedule.findOne({
      tenantId: data.tenantId,
      teacherId: data.teacherId,
      dayOfWeek: data.dayOfWeek,
      $or: [
        { startTime: { $lt: data.endTime, $gte: data.startTime } },
        { endTime: { $gt: data.startTime, $lte: data.endTime } },
      ],
    });

    if (conflicts) {
      throw new AppError('Schedule conflict detected for this teacher', 409);
    }

    const schedule = await Schedule.create(data);
    return schedule;
  }

  static async getAll(tenantId: string, sectionId?: string, teacherId?: string) {
    const filter: any = { tenantId };
    if (sectionId) {
      filter.sectionId = sectionId;
    }
    if (teacherId) {
      filter.teacherId = teacherId;
    }
    return await Schedule.find(filter)
      .populate('gradeId', 'name code')
      .populate('sectionId', 'name code')
      .populate('subjectId', 'name code')
      .populate('teacherId', 'firstName lastName email');
  }

  static async getById(id: string, tenantId: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError('Invalid ID format', 400);
    }
    const schedule = await Schedule.findOne({ _id: id, tenantId })
      .populate('gradeId', 'name code')
      .populate('sectionId', 'name code')
      .populate('subjectId', 'name code')
      .populate('teacherId', 'firstName lastName email');
    if (!schedule) {
      throw new AppError('Schedule entry not found', 404);
    }
    return schedule;
  }

  static async update(id: string, tenantId: string, data: any) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError('Invalid ID format', 400);
    }
    const schedule = await Schedule.findOneAndUpdate(
      { _id: id, tenantId },
      { $set: data },
      { new: true, runValidators: true }
    );
    if (!schedule) {
      throw new AppError('Schedule entry not found', 404);
    }
    return schedule;
  }

  static async delete(id: string, tenantId: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError('Invalid ID format', 400);
    }
    const schedule = await Schedule.findOneAndDelete({ _id: id, tenantId });
    if (!schedule) {
      throw new AppError('Schedule entry not found', 404);
    }
    return schedule;
  }

  static async getTimetableBySection(sectionId: string, tenantId: string) {
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
    const timetable: any = {};

    for (const day of days) {
      timetable[day] = await Schedule.find({
        tenantId,
        sectionId,
        dayOfWeek: day,
        status: 'active',
      })
        .populate('subjectId', 'name code')
        .populate('teacherId', 'firstName lastName')
        .populate('gradeId', 'name code')
        .sort({ startTime: 1 });
    }

    return timetable;
  }
}