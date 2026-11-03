import mongoose from 'mongoose';
import { Tenant } from '../../models/Tenant';
import { User } from '../../models/User';
import { Teacher } from '../../models/Teacher';
import { Student } from '../../models/Student';
import { AppError } from '../../middleware/error-handler';
import { config } from '../../config';
import {
  sendSchoolApprovedEmail,
  sendSchoolRejectedEmail,
} from '../../services/email.service';

/* ─────────────────────────────────────────────────────────────
   Return type definitions — explicit to prevent TS serialization
   errors on large inferred types.
   ───────────────────────────────────────────────────────────── */

export interface PlatformStats {
  schools: {
    total: number;
    pending: number;
    active: number;
    suspended: number;
    rejected: number;
  };
  users: {
    total: number;
    active: number;
    pending: number;
    admins: number;
    teachers: number;
    students: number;
    guardians: number;
  };
}

export interface PlatformActivityItem {
  id: string;
  type: string;
  icon: string;
  message: string;
  timestamp: Date;
}

export interface PendingCounts {
  schools: number;
  admins: number;
  teachers: number;
  students: number;
  guardians: number;
  total: number;
}

export interface SchoolListItem {
  _id: string;
  name: string;
  slug: string;
  status: string;
  email: string;
  phone: string;
  address: string;
  emailVerified: boolean;
  approvedBy?: string;
  approvedAt?: Date;
  rejectedBy?: string;
  rejectedAt?: Date;
  rejectionReason?: string;
  suspendedAt?: Date;
  suspendedReason?: string;
  createdAt: Date;
  updatedAt: Date;
  settings?: {
    affiliation?: string;
    affiliationNumber?: string;
  };
  admin?: {
    name: string;
    email: string;
    phone: string;
    designation: string;
    status: string;
  } | null;
  counts: {
    users: number;
    students: number;
    teachers: number;
  };
}

export interface SchoolListResult {
  items: SchoolListItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface UserListItem {
  _id: string;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  status: string;
  tenantId: string;
  tenantName: string;
  approvedBy?: string;
  approvedAt?: Date;
  rejectedAt?: Date;
  rejectionReason?: string;
  createdAt: Date;
}

export interface UserListResult {
  items: UserListItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/* ─────────────────────────────────────────────────────────────
   Helpers
   ───────────────────────────────────────────────────────────── */

async function safeCount(
  model: mongoose.Model<any>,
  query: any,
): Promise<number> {
  try {
    return await model.countDocuments(query);
  } catch {
    return 0;
  }
}

/* ─────────────────────────────────────────────────────────────
   Service
   ───────────────────────────────────────────────────────────── */

export class PlatformService {
  /* ═══════════════ DASHBOARD ═══════════════ */

  static async getStats(): Promise<PlatformStats> {
    const [
      totalSchools,
      pendingSchools,
      activeSchools,
      suspendedSchools,
      rejectedSchools,
      totalUsers,
      activeUsers,
      pendingUsers,
      totalStudents,
      totalTeachers,
      totalGuardians,
      totalAdmins,
    ] = await Promise.all([
      safeCount(Tenant, {}),
      safeCount(Tenant, { status: 'pending' }),
      safeCount(Tenant, { status: 'active' }),
      safeCount(Tenant, { status: 'suspended' }),
      safeCount(Tenant, { status: 'rejected' }),
      safeCount(User, {}),
      safeCount(User, { status: 'active' }),
      safeCount(User, { status: 'pending' }),
      safeCount(Student, { isDeleted: false }),
      safeCount(Teacher, { isDeleted: false }),
      safeCount(User, { role: 'guardian' }),
      safeCount(User, { role: 'admin' }),
    ]);

    return {
      schools: {
        total: totalSchools,
        pending: pendingSchools,
        active: activeSchools,
        suspended: suspendedSchools,
        rejected: rejectedSchools,
      },
      users: {
        total: totalUsers,
        active: activeUsers,
        pending: pendingUsers,
        admins: totalAdmins,
        teachers: totalTeachers,
        students: totalStudents,
        guardians: totalGuardians,
      },
    };
  }

  static async getRecentActivity(): Promise<PlatformActivityItem[]> {
    const activity: PlatformActivityItem[] = [];

    try {
      const recentSchools = await Tenant.find({})
        .sort({ createdAt: -1 })
        .limit(5)
        .select('name slug status createdAt')
        .lean();

      recentSchools.forEach((s: any) => {
        activity.push({
          id: `school_${s._id}`,
          type: 'school_registration',
          icon: '🏫',
          message: `${s.name} registered (${s.status})`,
          timestamp: s.createdAt,
        });
      });
    } catch {
      /* ignore */
    }

    try {
      const recentUsers = await User.find({})
        .sort({ createdAt: -1 })
        .limit(10)
        .select('firstName lastName email role status createdAt tenantId')
        .lean();

      for (const u of recentUsers as any[]) {
        activity.push({
          id: `user_${u._id}`,
          type: 'user_registration',
          icon:
            u.role === 'admin'
              ? '👨‍💼'
              : u.role === 'teacher'
                ? '👨‍🏫'
                : u.role === 'student'
                  ? '👨‍🎓'
                  : '👪',
          message: `${u.firstName} ${u.lastName} registered as ${u.role} (${u.status})`,
          timestamp: u.createdAt,
        });
      }
    } catch {
      /* ignore */
    }

    return activity
      .sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
      )
      .slice(0, 20);
  }

  static async getPendingCounts(): Promise<PendingCounts> {
    const [schools, admins, teachers, students, guardians] = await Promise.all([
      safeCount(Tenant, { status: 'pending' }),
      safeCount(User, { role: 'admin', status: 'pending' }),
      safeCount(User, { role: 'teacher', status: 'pending' }),
      safeCount(User, { role: 'student', status: 'pending' }),
      safeCount(User, { role: 'guardian', status: 'pending' }),
    ]);

    return {
      schools,
      admins,
      teachers,
      students,
      guardians,
      total: schools + admins + teachers + students + guardians,
    };
  }

  /* ═══════════════ GUARD — PLATFORM ADMIN'S OWN TENANT ═══════════════ */

  /**
   * Returns true if the given tenant hosts the platform admin's account.
   * Used to prevent self-suspend and self-delete.
   */
  static async isPlatformAdminTenant(tenantId: string): Promise<boolean> {
    try {
      if (!config.platformAdmin.email) return false;

      const admin = await User.findOne({
        tenantId,
        email: config.platformAdmin.email.toLowerCase().trim(),
      }).lean();

      return !!admin;
    } catch {
      return false;
    }
  }

  /* ═══════════════ SCHOOLS ═══════════════ */

  static async listSchools(filters: {
    status?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<SchoolListResult> {
    const query: any = {};

    if (filters.status && filters.status !== 'all') {
      query.status = filters.status;
    }

    if (filters.search) {
      query.$or = [
        { name: { $regex: filters.search, $options: 'i' } },
        { slug: { $regex: filters.search, $options: 'i' } },
        { email: { $regex: filters.search, $options: 'i' } },
      ];
    }

    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const skip = (page - 1) * limit;

    const [schools, total] = await Promise.all([
      Tenant.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Tenant.countDocuments(query),
    ]);

    const enriched: SchoolListItem[] = await Promise.all(
      schools.map(async (s: any) => {
        const tid = s._id.toString();
        const [userCount, studentCount, teacherCount, adminUser] = await Promise.all([
          safeCount(User, { tenantId: tid }),
          safeCount(Student, { tenantId: tid, isDeleted: false }),
          safeCount(Teacher, { tenantId: tid, isDeleted: false }),
          User.findOne({ tenantId: tid, role: 'admin' })
            .select('firstName lastName email phone bio status')
            .lean(),
        ]);

        return {
          _id: tid,
          name: s.name,
          slug: s.slug,
          status: s.status,
          email: s.email || '',
          phone: s.phone || '',
          address: s.address || '',
          emailVerified: s.emailVerified || false,
          approvedBy: s.approvedBy,
          approvedAt: s.approvedAt,
          rejectedBy: s.rejectedBy,
          rejectedAt: s.rejectedAt,
          rejectionReason: s.rejectionReason,
          suspendedAt: s.suspendedAt,
          suspendedReason: s.suspendedReason,
          createdAt: s.createdAt,
          updatedAt: s.updatedAt,
          settings: s.settings || {},
          admin: adminUser
            ? {
                name: `${adminUser.firstName} ${adminUser.lastName}`.trim(),
                email: adminUser.email,
                phone: adminUser.phone || '',
                designation: adminUser.bio || 'School Administrator',
                status: adminUser.status,
              }
            : null,
          counts: {
            users: userCount,
            students: studentCount,
            teachers: teacherCount,
          },
        };
      }),
    );

    return {
      items: enriched,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  static async getSchoolById(tenantId: string): Promise<any> {
    if (!mongoose.Types.ObjectId.isValid(tenantId)) {
      throw new AppError('Invalid tenant ID', 400);
    }

    const school = await Tenant.findById(tenantId).lean();
    if (!school) {
      throw new AppError('School not found', 404);
    }

    const users = await User.find({ tenantId })
      .select('firstName lastName email role status createdAt')
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    const isPlatformTenant = await this.isPlatformAdminTenant(tenantId);

    return {
      ...school,
      _id: school._id.toString(),
      isPlatformTenant,
      users: users.map((u: any) => ({
        _id: u._id.toString(),
        name: `${u.firstName} ${u.lastName}`,
        email: u.email,
        role: u.role,
        status: u.status,
        createdAt: u.createdAt,
      })),
    };
  }

  static async approveSchool(
    tenantId: string,
    approverEmail: string,
  ): Promise<any> {
    if (!mongoose.Types.ObjectId.isValid(tenantId)) {
      throw new AppError('Invalid tenant ID', 400);
    }

    const school = await Tenant.findById(tenantId);
    if (!school) {
      throw new AppError('School not found', 404);
    }

    if (school.status === 'active') {
      throw new AppError('School is already active', 400);
    }

    school.status = 'active';
    school.approvedBy = approverEmail;
    school.approvedAt = new Date();

    school.rejectionReason = undefined;
    school.rejectedAt = undefined;
    school.rejectedBy = undefined;

    await school.save();

    // Activate the school's administrator account(s)
    await User.updateMany(
      { tenantId, role: 'admin', status: 'pending' },
      { status: 'active', approvedBy: approverEmail, approvedAt: new Date() },
    );

    const adminUser = await User.findOne({ tenantId, role: 'admin' });
    const adminName = adminUser ? `${adminUser.firstName} ${adminUser.lastName}` : 'Administrator';
    const recipientEmail = adminUser?.email || school.email;

    if (recipientEmail) {
      try {
        await sendSchoolApprovedEmail(
          recipientEmail,
          school.name,
          adminName,
        );
        console.log(`📧 Approval email sent to ${recipientEmail}`);
      } catch (err) {
        console.error('Failed to send school approval email:', err);
      }
    }

    return {
      _id: school._id.toString(),
      name: school.name,
      slug: school.slug,
      status: school.status,
    };
  }

  static async rejectSchool(
    tenantId: string,
    rejectorEmail: string,
    reason: string,
  ): Promise<any> {
    if (!mongoose.Types.ObjectId.isValid(tenantId)) {
      throw new AppError('Invalid tenant ID', 400);
    }

    const school = await Tenant.findById(tenantId);
    if (!school) {
      throw new AppError('School not found', 404);
    }

    school.status = 'rejected';
    school.rejectedBy = rejectorEmail;
    school.rejectedAt = new Date();
    school.rejectionReason = reason;

    await school.save();

    if (school.email) {
      try {
        await sendSchoolRejectedEmail(
          school.email,
          school.name,
          'Admin',
          reason,
        );
        console.log(`📧 Rejection email sent to ${school.email}`);
      } catch (err) {
        console.error('Failed to send school rejection email:', err);
      }
    }

    return {
      _id: school._id.toString(),
      name: school.name,
      status: school.status,
      rejectionReason: school.rejectionReason,
    };
  }

  /* ⚠️ SUSPEND — with self-lockout guard */
  static async suspendSchool(
    tenantId: string,
    _suspenderEmail: string,
    reason: string,
  ): Promise<any> {
    if (!mongoose.Types.ObjectId.isValid(tenantId)) {
      throw new AppError('Invalid tenant ID', 400);
    }

    // Guard: platform admin cannot suspend their own tenant
    if (await this.isPlatformAdminTenant(tenantId)) {
      throw new AppError(
        'You cannot suspend your own platform-admin school. ' +
          'This tenant hosts the founder account and must remain active.',
        403,
      );
    }

    const school = await Tenant.findByIdAndUpdate(
      tenantId,
      {
        $set: {
          status: 'suspended',
          suspendedAt: new Date(),
          suspendedReason: reason,
        },
      },
      { new: true },
    );

    if (!school) {
      throw new AppError('School not found', 404);
    }

    return {
      _id: school._id.toString(),
      name: school.name,
      status: school.status,
      suspendedReason: school.suspendedReason,
    };
  }

  static async reactivateSchool(
    tenantId: string,
    _approverEmail: string,
  ): Promise<any> {
    if (!mongoose.Types.ObjectId.isValid(tenantId)) {
      throw new AppError('Invalid tenant ID', 400);
    }

    const school = await Tenant.findByIdAndUpdate(
      tenantId,
      {
        $set: {
          status: 'active',
          suspendedAt: undefined,
          suspendedReason: undefined,
        },
      },
      { new: true },
    );

    if (!school) {
      throw new AppError('School not found', 404);
    }

    return {
      _id: school._id.toString(),
      name: school.name,
      status: school.status,
    };
  }

  /* ⚠️ DELETE — with self-lockout guard */
  static async deleteSchool(tenantId: string): Promise<any> {
    if (!mongoose.Types.ObjectId.isValid(tenantId)) {
      throw new AppError('Invalid tenant ID', 400);
    }

    // Guard: platform admin cannot delete their own tenant
    if (await this.isPlatformAdminTenant(tenantId)) {
      throw new AppError(
        'You cannot delete the school that hosts your platform-admin account.',
        403,
      );
    }

    const school = await Tenant.findByIdAndDelete(tenantId);
    if (!school) {
      throw new AppError('School not found', 404);
    }

    await Promise.all([
      User.deleteMany({ tenantId }),
      Teacher.deleteMany({ tenantId }),
      Student.deleteMany({ tenantId }),
    ]);

    return school;
  }

  /* ═══════════════ USERS ═══════════════ */

  static async listUsers(filters: {
    tenantId?: string;
    role?: string;
    status?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<UserListResult> {
    const query: any = {};

    if (filters.tenantId) query.tenantId = filters.tenantId;
    if (filters.role) query.role = filters.role;
    if (filters.status && filters.status !== 'all') query.status = filters.status;

    if (filters.search) {
      query.$or = [
        { firstName: { $regex: filters.search, $options: 'i' } },
        { lastName: { $regex: filters.search, $options: 'i' } },
        { email: { $regex: filters.search, $options: 'i' } },
      ];
    }

    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      User.find(query)
        .select(
          'firstName lastName email role status tenantId approvedBy approvedAt rejectedAt rejectionReason createdAt',
        )
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      User.countDocuments(query),
    ]);

    const tenantIds = [...new Set(users.map((u: any) => u.tenantId))];
    const tenants = await Tenant.find({ _id: { $in: tenantIds } })
      .select('name slug')
      .lean();
    const tenantMap = new Map(tenants.map((t: any) => [t._id.toString(), t]));

    const enriched: UserListItem[] = users.map((u: any) => {
      const tenant: any = tenantMap.get(u.tenantId);
      return {
        _id: u._id.toString(),
        name: `${u.firstName} ${u.lastName}`,
        firstName: u.firstName,
        lastName: u.lastName,
        email: u.email,
        role: u.role,
        status: u.status,
        tenantId: u.tenantId,
        tenantName: tenant?.name || 'Unknown',
        approvedBy: u.approvedBy,
        approvedAt: u.approvedAt,
        rejectedAt: u.rejectedAt,
        rejectionReason: u.rejectionReason,
        createdAt: u.createdAt,
      };
    });

    return {
      items: enriched,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  static async getUserById(userId: string): Promise<any> {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new AppError('Invalid user ID', 400);
    }

    const user = await User.findById(userId).select('-passwordHash').lean();
    if (!user) {
      throw new AppError('User not found', 404);
    }

    const tenant = await Tenant.findById(user.tenantId)
      .select('name slug')
      .lean();

    return {
      ...user,
      _id: user._id.toString(),
      tenantName: tenant?.name || 'Unknown',
      tenantSlug: tenant?.slug || '',
    };
  }

  static async approveUser(userId: string, approverEmail: string): Promise<any> {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new AppError('Invalid user ID', 400);
    }

    const user = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          status: 'active',
          approvedBy: approverEmail,
          approvedAt: new Date(),
          rejectionReason: undefined,
          rejectedAt: undefined,
          rejectedBy: undefined,
        },
      },
      { new: true },
    );

    if (!user) throw new AppError('User not found', 404);

    if (user.role === 'teacher') {
      await Teacher.findOneAndUpdate(
        { userId: user._id.toString() },
        {
          $set: {
            status: 'active',
            approvedBy: approverEmail,
            approvedAt: new Date(),
          },
        },
      );
    }
    if (user.role === 'student') {
      await Student.findOneAndUpdate(
        { userId: user._id.toString() },
        {
          $set: {
            status: 'active',
            approvedBy: approverEmail,
            approvedAt: new Date(),
          },
        },
      );
    }

    return {
      _id: user._id.toString(),
      status: user.status,
      email: user.email,
      role: user.role,
    };
  }

  static async rejectUser(
    userId: string,
    rejectorEmail: string,
    reason: string,
  ): Promise<any> {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new AppError('Invalid user ID', 400);
    }

    const user = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          status: 'rejected',
          rejectedBy: rejectorEmail,
          rejectedAt: new Date(),
          rejectionReason: reason,
        },
      },
      { new: true },
    );

    if (!user) throw new AppError('User not found', 404);

    if (user.role === 'teacher') {
      await Teacher.findOneAndUpdate(
        { userId: user._id.toString() },
        { $set: { status: 'rejected', rejectionReason: reason } },
      );
    }
    if (user.role === 'student') {
      await Student.findOneAndUpdate(
        { userId: user._id.toString() },
        { $set: { status: 'rejected', rejectionReason: reason } },
      );
    }

    return {
      _id: user._id.toString(),
      status: user.status,
      email: user.email,
      role: user.role,
      rejectionReason: user.rejectionReason,
    };
  }

  static async suspendUser(
    userId: string,
    _suspenderEmail: string,
    reason: string,
  ): Promise<any> {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new AppError('Invalid user ID', 400);
    }

    const user = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          status: 'suspended',
          suspendedAt: new Date(),
          suspendedReason: reason,
        },
      },
      { new: true },
    );

    if (!user) throw new AppError('User not found', 404);

    return {
      _id: user._id.toString(),
      status: user.status,
      email: user.email,
    };
  }

  static async reactivateUser(
    userId: string,
    _approverEmail: string,
  ): Promise<any> {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new AppError('Invalid user ID', 400);
    }

    const user = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          status: 'active',
          suspendedAt: undefined,
          suspendedReason: undefined,
        },
      },
      { new: true },
    );

    if (!user) throw new AppError('User not found', 404);

    return {
      _id: user._id.toString(),
      status: user.status,
      email: user.email,
    };
  }
}