import mongoose from 'mongoose';
import { User } from '../../models/User';
import { Tenant } from '../../models/Tenant';
import { Student } from '../../models/Student';
import { Teacher } from '../../models/Teacher';
import { Attendance } from '../../models/Attendance';
import { AppError } from '../../middleware/error-handler';

/* ─────────────────────────────────────────────────────────────
   Interfaces
   ───────────────────────────────────────────────────────────── */

interface UserData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

interface TenantData {
  id: string;
  name: string;
}

interface DashboardStats {
  totalStudents: number;
  totalTeachers: number;
  attendance: string;
}

interface ActivityItem {
  id: string;
  icon: string;
  message: string;
  timestamp: string;
  type: string;
}

interface QuickAction {
  label: string;
  icon: string;
  path: string;
  color: string;
}

interface QuickStats {
  totalStudents: number;
  totalTeachers: number;
}

interface AdminData {
  quickActions: QuickAction[];
  quickStats: QuickStats;
}

interface MyClass {
  name: string;
  section: string;
  time: string;
}

interface PendingTask {
  title: string;
  count: number;
}

interface TeacherData {
  myClasses: MyClass[];
  pendingTasks: PendingTask[];
}

interface TimetableClass {
  subject: string;
  time: string;
  room: string;
  teacher: string;
}

interface Grade {
  subject: string;
  grade: string;
  score: string;
  date: string;
}

interface StudentData {
  timetable: TimetableClass[];
  recentGrades: Grade[];
  upcomingTests: any[];
  grade: string;
  section: string;
}

interface ChildSubject {
  name: string;
  grade: string;
  score: string;
}

interface Child {
  id: string;
  name: string;
  grade: string;
  section: string;
  rollNo: string;
  attendance: string;
  grades: string;
  averageScore: number;
  subjects: ChildSubject[];
}

interface GuardianData {
  children: Child[];
}

interface DashboardResponse {
  user: UserData;
  tenant: TenantData;
  stats: DashboardStats;
  recentActivity: ActivityItem[];
  quickActions?: QuickAction[];
  quickStats?: QuickStats;
  myClasses?: MyClass[];
  pendingTasks?: PendingTask[];
  timetable?: TimetableClass[];
  recentGrades?: Grade[];
  children?: Child[];
}

async function safeCount(
  model: mongoose.Model<any>,
  query: any,
): Promise<number> {
  try {
    return await model.countDocuments(query);
  } catch (err) {
    console.warn(
      `[dashboard] countDocuments failed on ${model.modelName} — returning 0`,
      err instanceof Error ? err.message : err,
    );
    throw err;
  }
}

/* ─────────────────────────────────────────────────────────────
   Service
   ───────────────────────────────────────────────────────────── */

export class DashboardService {
  static async getDashboardData(
    userId: string,
    tenantId: string,
    role: string,
  ): Promise<DashboardResponse> {
    const tenant = await Tenant.findById(tenantId);
    if (!tenant) {
      throw new AppError('Tenant not found', 404);
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    const stats = await this.getStats(tenantId, role);
    const recentActivity = await this.getRecentActivity(tenantId, userId, role);

    let roleSpecificData: Record<string, any> = {};
    switch (role) {
      case 'admin':
        roleSpecificData = await this.getAdminData(tenantId);
        break;
      case 'teacher':
        roleSpecificData = await this.getTeacherData(userId, tenantId);
        break;
      case 'student':
        roleSpecificData = await this.getStudentData(userId, tenantId);
        break;
      case 'guardian':
        roleSpecificData = await this.getGuardianData(userId, tenantId);
        break;
      default:
        break;
    }

    return {
      user: {
        id: user._id.toString(),
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
      tenant: {
        id: tenant._id.toString(),
        name: tenant.name,
      },
      stats,
      recentActivity,
      ...roleSpecificData,
    };
  }

  static async getStats(tenantId: string, _role: string): Promise<DashboardStats> {
    const [totalStudents, totalTeachers] = await Promise.all([
      safeCount(Student, { tenantId, isDeleted: false }),
      safeCount(Teacher, { tenantId, isDeleted: false }),
    ]);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayAttendance = await safeCount(Attendance, {
      tenantId,
      date: today,
      status: { $in: ['present', 'late', 'half_day'] },
    });

    const totalAttendance = await safeCount(Attendance, {
      tenantId,
      date: today,
    });

    const attendancePercentage =
      totalAttendance > 0
        ? Math.round((todayAttendance / totalAttendance) * 100)
        : 0;

    return {
      totalStudents: totalStudents || 0,
      totalTeachers: totalTeachers || 0,
      attendance: `${attendancePercentage}%`,
    };
  }

  static async getRecentActivity(
    tenantId: string,
    _userId: string,
    _role: string,
  ): Promise<ActivityItem[]> {
    const activities: ActivityItem[] = [];

    try {
      const recentStudents = await Student.find({ tenantId, isDeleted: false })
        .sort({ createdAt: -1 })
        .limit(3)
        .select('firstName lastName createdAt');

      recentStudents.forEach((student: any) => {
        activities.push({
          id: `student_${student._id}`,
          icon: '👨‍🎓',
          message: `${student.firstName} ${student.lastName} registered as a student`,
          timestamp: this.getTimeAgo(student.createdAt),
          type: 'student_registration',
        });
      });
    } catch {
      /* safe */
    }

    try {
      const recentTeachers = await Teacher.find({ tenantId, isDeleted: false })
        .sort({ createdAt: -1 })
        .limit(2)
        .select('firstName lastName createdAt');

      recentTeachers.forEach((teacher: any) => {
        activities.push({
          id: `teacher_${teacher._id}`,
          icon: '👨‍🏫',
          message: `${teacher.firstName} ${teacher.lastName} joined as a teacher`,
          timestamp: this.getTimeAgo(teacher.createdAt),
          type: 'teacher_registration',
        });
      });
    } catch {
      /* safe */
    }

    return activities.slice(0, 10);
  }

  static async getAdminData(tenantId: string): Promise<AdminData> {
    const [totalStudents, totalTeachers] = await Promise.all([
      safeCount(Student, { tenantId, isDeleted: false }),
      safeCount(Teacher, { tenantId, isDeleted: false }),
    ]);

    return {
      quickActions: [
        { label: 'Add Student', icon: '➕', path: '/students/add', color: 'blue' },
        { label: 'Add Teacher', icon: '👨‍🏫', path: '/teachers/add', color: 'green' },
        {
          label: 'Mark Attendance',
          icon: '✅',
          path: '/attendance/mark',
          color: 'purple',
        },
        {
          label: 'Attendance Reports',
          icon: '📊',
          path: '/attendance/reports',
          color: 'red',
        },
      ],
      quickStats: {
        totalStudents,
        totalTeachers,
      },
    };
  }

  static async getTeacherData(
    userId: string,
    tenantId: string,
  ): Promise<TeacherData> {
    const teacher = await Teacher.findOne({
      userId,
      tenantId,
      isDeleted: false,
    });

    if (!teacher) {
      return { myClasses: [], pendingTasks: [] };
    }

    try {
      const TimetableEntry = mongoose.model('TimetableEntry');
      const classes = await TimetableEntry.find({
        tenantId,
        teacherId: teacher._id,
      })
        .populate('subjectId', 'name')
        .populate('sectionId', 'name')
        .populate('gradeId', 'name')
        .limit(5);

      const myClasses = classes.map((cls: any) => ({
        name: `${cls.subjectId?.name || 'Unknown'} - ${
          cls.gradeId?.name || 'Unknown'
        }`,
        section: cls.sectionId?.name || 'N/A',
        time: `${cls.startTime} - ${cls.endTime}`,
      }));

      const Assignment = mongoose.model('Assignment');
      const pendingAssignments = await Assignment.countDocuments({
        tenantId,
        teacherId: teacher._id,
        status: 'published',
      });

      return {
        myClasses: myClasses.slice(0, 5),
        pendingTasks: [
          { title: 'Grade assignments', count: pendingAssignments || 0 },
          { title: 'Prepare lesson plans', count: 0 },
          { title: 'Parent meetings', count: 0 },
        ],
      };
    } catch {
      return { myClasses: [], pendingTasks: [] };
    }
  }

  static async getStudentData(
    userId: string,
    tenantId: string,
  ): Promise<StudentData> {
    const student = await Student.findOne({
      userId,
      tenantId,
      isDeleted: false,
    });

    if (!student) {
      return {
        timetable: [],
        recentGrades: [],
        upcomingTests: [],
        grade: 'N/A',
        section: 'N/A',
      };
    }

    try {
      const TimetableEntry = mongoose.model('TimetableEntry');
      const today = new Date();
      const days = [
        'sunday',
        'monday',
        'tuesday',
        'wednesday',
        'thursday',
        'friday',
        'saturday',
      ];
      const dayName = days[today.getDay()];

      const timetable = await TimetableEntry.find({
        tenantId,
        sectionId: student.sectionId || student.section || '',
        dayOfWeek: dayName,
      })
        .populate('subjectId', 'name')
        .populate('teacherId', 'firstName lastName')
        .sort({ startTime: 1 })
        .limit(5);

      const Gradebook = mongoose.model('Gradebook');
      const grades = await Gradebook.find({
        tenantId,
        studentId: student._id,
      })
        .populate('subjectId', 'name')
        .sort({ updatedAt: -1 })
        .limit(5);

      const overallGrade =
        grades.length > 0
          ? grades.reduce(
              (acc: number, g: any) => acc + (g.averageScore || 0),
              0,
            ) / grades.length
          : 0;

      const Assignment = mongoose.model('Assignment');
      const assignments = await Assignment.find({
        tenantId,
        sectionId: student.sectionId || student.section,
        isPublished: true,
        dueDate: { $gte: new Date() },
      })
        .populate('subjectId', 'name')
        .sort({ dueDate: 1 })
        .limit(5);

      return {
        timetable: timetable.map((cls: any) => ({
          subject: cls.subjectId?.name || 'Unknown',
          time: `${cls.startTime} - ${cls.endTime}`,
          room: cls.roomNumber || 'N/A',
          teacher: cls.teacherId
            ? `${cls.teacherId.firstName} ${cls.teacherId.lastName}`
            : 'N/A',
        })),
        recentGrades: grades.map((g: any) => ({
          subject: g.subjectId?.name || 'Unknown',
          grade: g.grade || 'N/A',
          score: `${Math.round(g.averageScore || 0)}%`,
          date: g.updatedAt ? this.getTimeAgo(g.updatedAt) : 'N/A',
        })),
        upcomingTests: assignments.map((a: any) => ({
          title: a.title,
          subject: a.subjectId?.name || 'Unknown',
          dueDate: a.dueDate,
          priority: 'medium',
        })),
        grade: this.calculateGrade(overallGrade),
        section: student.section || 'N/A',
      };
    } catch (error) {
      console.error('Error fetching student data:', error);
      return {
        timetable: [],
        recentGrades: [],
        upcomingTests: [],
        grade: 'N/A',
        section: student.section || 'N/A',
      };
    }
  }

  /* ─────────────────────────────────────────────────────────────
     GUARDIAN DATA — with multi-strategy linking fallback
     ───────────────────────────────────────────────────────────── */

  static async getGuardianData(
    userId: string,
    tenantId: string,
  ): Promise<GuardianData> {
    // ── Step 1: Find linked students using multiple strategies ──

    let students: any[] = [];

    // Strategy 1: Match by guardians[].userId (the primary linkage)
    try {
      students = await Student.find({
        tenantId,
        'guardians.userId': userId,
        isDeleted: false,
      })
        .select('_id firstName lastName grade section sectionId rollNo guardians')
        .lean();
    } catch (err) {
      console.warn('[dashboard] guardian query (userId) failed:', err);
    }

    // Strategy 2: Match by guardians[].email using the guardian's User email
    if (students.length === 0) {
      try {
        const guardianUser: any = await User.findById(userId)
          .select('email')
          .lean();

        if (guardianUser?.email) {
          students = await Student.find({
            tenantId,
            'guardians.email': guardianUser.email,
            isDeleted: false,
          })
            .select('_id firstName lastName grade section sectionId rollNo guardians')
            .lean();

          if (students.length > 0) {
            console.log(
              `[dashboard] Guardian linked via email fallback: ${guardianUser.email}`,
            );
            // Auto-heal: backfill userId on matched guardians so this
            // doesn't need to happen again.
            for (const s of students) {
              const needsUpdate = (s.guardians || []).some(
                (g: any) => g.email === guardianUser.email && !g.userId,
              );
              if (needsUpdate) {
                await Student.updateOne(
                  { _id: s._id, 'guardians.email': guardianUser.email },
                  { $set: { 'guardians.$.userId': userId } },
                );
                console.log(
                  `[dashboard] Auto-linked guardian to student ${s._id}`,
                );
              }
            }
          }
        }
      } catch (err) {
        console.warn('[dashboard] guardian query (email fallback) failed:', err);
      }
    }

    // Strategy 3: Full scan — filter in JS. Last resort.
    if (students.length === 0) {
      try {
        const allStudents = await Student.find({
          tenantId,
          isDeleted: false,
          guardians: {
            $elemMatch: { userId: { $exists: true, $ne: null } },
          },
        })
          .select('_id firstName lastName grade section sectionId rollNo guardians')
          .lean();

        students = allStudents.filter((s: any) =>
          (s.guardians || []).some((g: any) => g.userId === userId),
        );
      } catch (err) {
        console.warn('[dashboard] guardian query (full scan) failed:', err);
      }
    }

    // ── Step 2: Build the children array ──

    const children: Child[] = await Promise.all(
      students.map(async (s: any) => {
        const studentId = s._id.toString();

        // Attendance
        const totalAttendance = await safeCount(Attendance, {
          tenantId,
          entityId: studentId,
          type: 'student',
        });
        const presentOrLate = await safeCount(Attendance, {
          tenantId,
          entityId: studentId,
          type: 'student',
          status: { $in: ['present', 'late', 'half_day'] },
        });
        const attendancePct =
          totalAttendance > 0
            ? Math.round((presentOrLate / totalAttendance) * 100)
            : 0;

        // Gradebook
        const Gradebook = mongoose.model('Gradebook');
        let gradebooks: any[] = [];
        try {
          gradebooks = await Gradebook.find({
            tenantId,
            studentId: s._id,
          }).lean();
        } catch {
          gradebooks = [];
        }

        let overallGrade = 'N/A';
        let averageScore = 0;

        if (gradebooks.length > 0) {
          const totalScore = gradebooks.reduce(
            (sum: number, g: any) => sum + (g.averageScore || 0),
            0,
          );
          averageScore = totalScore / gradebooks.length;
          overallGrade = this.calculateGrade(averageScore);
        }

        // Subject-wise breakdown
        const Subject = mongoose.model('Subject');
        const subjects: ChildSubject[] = await Promise.all(
          gradebooks.slice(0, 3).map(async (g: any) => {
            let subjectDoc: any = null;
            try {
              subjectDoc = await Subject.findById(g.subjectId)
                .select('name')
                .lean();
            } catch {
              subjectDoc = null;
            }
            return {
              name: subjectDoc?.name || 'Unknown',
              grade: g.grade || 'N/A',
              score: `${Math.round(g.averageScore || 0)}%`,
            };
          }),
        );

        return {
          id: studentId,
          name: `${s.firstName} ${s.lastName}`,
          grade: s.grade || 'N/A',
          section: s.section || '',
          rollNo: s.rollNo || '',
          attendance: `${attendancePct}%`,
          grades: overallGrade,
          averageScore: Math.round(averageScore),
          subjects,
        };
      }),
    );

    return {
      children,
    };
  }

  /* ─────────────────────────────────────────────────────────────
     Helpers
     ───────────────────────────────────────────────────────────── */

  private static calculateGrade(score: number): string {
    if (score >= 90) return 'A+';
    if (score >= 80) return 'A';
    if (score >= 70) return 'B+';
    if (score >= 60) return 'B';
    if (score >= 50) return 'C+';
    if (score >= 40) return 'C';
    return 'F';
  }

  private static getTimeAgo(date: Date): string {
    const diff = Date.now() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    return 'Just now';
  }

  static async getStudents(tenantId: string): Promise<any[]> {
    try {
      return await Student.find({ tenantId, isDeleted: false })
        .select('firstName lastName grade section')
        .limit(10);
    } catch {
      return [];
    }
  }

  static async getTeachers(tenantId: string): Promise<any[]> {
    try {
      return await Teacher.find({ tenantId, isDeleted: false })
        .select('firstName lastName')
        .limit(10);
    } catch {
      return [];
    }
  }

  static async getClasses(tenantId: string): Promise<any[]> {
    try {
      const TimetableEntry = mongoose.model('TimetableEntry');
      const sections = await TimetableEntry.aggregate([
        { $match: { tenantId } },
        { $group: { _id: '$sectionId', count: { $sum: 1 } } },
        { $limit: 10 },
      ]);
      return sections;
    } catch {
      return [];
    }
  }
}