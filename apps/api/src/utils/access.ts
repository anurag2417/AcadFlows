import { Student } from '../models/Student';
import { AppError } from '../middleware/error-handler';

export type AuthUser = {
  id: string;
  tenantId: string;
  role: string;
};

/**
 * Student IDs the caller may see. `'all'` means every student in the tenant
 * (admin / teacher). An empty array means no access.
 */
export async function accessibleStudentIds(
  user: AuthUser,
): Promise<'all' | string[]> {
  if (user.role === 'admin' || user.role === 'teacher') {
    return 'all';
  }

  if (user.role === 'student') {
    const student = await Student.findOne({
      userId: user.id,
      tenantId: user.tenantId,
      isDeleted: false,
    }).select('_id');
    return student ? [student._id.toString()] : [];
  }

  if (user.role === 'guardian') {
    const children = await Student.find({
      tenantId: user.tenantId,
      isDeleted: false,
      'guardians.userId': user.id,
    }).select('_id');
    return children.map(c => c._id.toString());
  }

  return [];
}

export async function assertCanAccessStudent(
  user: AuthUser,
  studentId: string,
): Promise<void> {
  const allowed = await accessibleStudentIds(user);
  if (allowed === 'all') return;
  if (!allowed.includes(studentId)) {
    throw new AppError('Insufficient permissions', 403);
  }
}

export function assertCanAccessFinancials(user: AuthUser): void {
  if (user.role !== 'admin') {
    throw new AppError('Insufficient permissions', 403);
  }
}
