import { Request, Response, NextFunction } from 'express';
import { AssignmentService } from './service';
import { z } from 'zod';
import { AuthRequest } from '../../middleware/auth';
import { Teacher } from '../../models/Teacher';
import { Student } from '../../models/Student';
import { AppError } from '../../middleware/error-handler';
import { parsePagination } from '../../utils/pagination';

// Validation Schemas
const createAssignmentSchema = z.object({
  academicYearId: z.string().min(1),
  sectionId: z.string().min(1),
  subjectId: z.string().min(1),
  teacherId: z.string().min(1).optional(),
  title: z.string().min(1),
  description: z.string().min(1),
  type: z.enum(['homework', 'classwork', 'project', 'quiz', 'test', 'exam']),
  maxScore: z.number().min(0),
  weightage: z.number().min(0).max(100),
  dueDate: z.coerce.date(),
  instructions: z.string().optional(),
  attachments: z.array(z.object({
    name: z.string(),
    url: z.string(),
    size: z.number().optional(),
  })).optional(),
  isPublished: z.boolean().default(false),
});

const submitAssignmentSchema = z.object({
  assignmentId: z.string().min(1),
  studentId: z.string().optional(), // required only when admin/teacher submits on behalf
  content: z.string().optional(),
  attachments: z.array(z.object({
    name: z.string(),
    url: z.string(),
    size: z.number().optional(),
  })).optional(),
});

const gradeSubmissionSchema = z.object({
  score: z.number().min(0),
  feedback: z.string().optional(),
});

const generateReportCardSchema = z.object({
  studentId: z.string().min(1),
  academicYearId: z.string().min(1),
  term: z.enum(['first', 'second', 'third', 'final']),
});

export class AssignmentController {
  // ============ Assignments ============

  static async createAssignment(req: Request, res: Response, next: NextFunction) {
    try {
      const authReq = req as AuthRequest;
      const validated = createAssignmentSchema.parse(req.body);

      const teacher = await Teacher.findOne({
        userId: authReq.user.id,
        tenantId: authReq.user.tenantId,
        isDeleted: false,
      });
      const teacherId = validated.teacherId || teacher?._id.toString();
      if (!teacherId) {
        throw new AppError('A teacher profile or teacherId is required', 400);
      }
      if (!teacher || validated.teacherId) {
        const assignedTeacher = await Teacher.findOne({
          _id: teacherId,
          tenantId: authReq.user.tenantId,
          isDeleted: false,
        });
        if (!assignedTeacher) {
          throw new AppError('Teacher profile not found', 404);
        }
      }

      const assignment = await AssignmentService.createAssignment(
        authReq.user.tenantId,
        {
          ...validated,
          teacherId,
          createdBy: authReq.user.id,
        }
      );

      res.status(201).json({
        success: true,
        data: assignment,
        message: 'Assignment created successfully!',
      });
    } catch (error) {
      next(error);
    }
  }

  static async getAssignments(req: Request, res: Response, next: NextFunction) {
    try {
      const authReq = req as AuthRequest;
      const { sectionId, subjectId, teacherId, status, type, page: rawPage, limit: rawLimit } = req.query;
      const pagination = parsePagination(rawPage, rawLimit);

      const result = await AssignmentService.getAssignments(
        authReq.user.tenantId,
        {
          sectionId: sectionId as string,
          subjectId: subjectId as string,
          teacherId: teacherId as string,
          status: status as string,
          type: type as string,
          ...pagination,
        }
      );

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getAssignmentById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const assignment = await AssignmentService.getAssignmentById(id, (req as AuthRequest).user.tenantId);

      res.json({
        success: true,
        data: assignment,
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateAssignment(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const validated = createAssignmentSchema.partial().parse(req.body);

      const assignment = await AssignmentService.updateAssignment(id, (req as AuthRequest).user.tenantId, validated);

      res.json({
        success: true,
        data: assignment,
        message: 'Assignment updated successfully!',
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteAssignment(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await AssignmentService.deleteAssignment(id, (req as AuthRequest).user.tenantId);

      res.json({
        success: true,
        message: 'Assignment deleted successfully!',
      });
    } catch (error) {
      next(error);
    }
  }

  static async getAssignmentStats(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const authReq = req as AuthRequest;

      const stats = await AssignmentService.getAssignmentStats(
        authReq.user.tenantId,
        id
      );

      res.json({
        success: true,
        data: stats,
      });
    } catch (error) {
      next(error);
    }
  }

  // ============ Submissions ============

  static async submitAssignment(req: Request, res: Response, next: NextFunction) {
    try {
      const authReq = req as AuthRequest;
      const validated = submitAssignmentSchema.parse(req.body);

      // `studentId` in the request body.)
      let studentId: string;
      if (authReq.user.role === 'student') {
        const student = await Student.findOne({
          userId: authReq.user.id,
          tenantId: authReq.user.tenantId,
          isDeleted: false,
        });
        if (!student) {
          throw new AppError('Student profile not found for this user', 404);
        }
        studentId = student._id.toString();
      } else {
        // Admin/teacher submitting on behalf — require explicit studentId
        const bodyStudentId = (req.body as any).studentId;
        if (!bodyStudentId) {
          throw new AppError('studentId is required when submitting on behalf of a student', 400);
        }
        studentId = bodyStudentId;
      }

      const submission = await AssignmentService.submitAssignment(
        authReq.user.tenantId,
        {
          ...validated,
          studentId,
        },
        { userId: authReq.user.id, role: authReq.user.role },
      );

      res.status(201).json({
        success: true,
        data: submission,
        message: 'Assignment submitted successfully!',
      });
    } catch (error) {
      next(error);
    }
  }

  static async getSubmissions(req: Request, res: Response, next: NextFunction) {
    try {
      const authReq = req as AuthRequest;
      const { assignmentId, studentId, status, page: rawPage, limit: rawLimit } = req.query;
      const pagination = parsePagination(rawPage, rawLimit);
      let scopedStudentId = studentId as string;
      if (authReq.user.role === 'student') {
        const student = await Student.findOne({
          userId: authReq.user.id,
          tenantId: authReq.user.tenantId,
          isDeleted: false,
        }).select('_id');
        if (!student) throw new AppError('Student profile not found', 404);
        scopedStudentId = student._id.toString();
      }
      let studentIds: string[] | undefined;
      if (authReq.user.role === 'guardian') {
        const linked = await Student.find({
          tenantId: authReq.user.tenantId,
          'guardians.userId': authReq.user.id,
          isDeleted: false,
        }).select('_id');
        studentIds = linked.map(student => student._id.toString());
      }

      const result = await AssignmentService.getSubmissions(
        authReq.user.tenantId,
        {
          assignmentId: assignmentId as string,
          studentId: scopedStudentId,
          studentIds,
          status: status as string,
          ...pagination,
        }
      );

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getSubmissionById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const authReq = req as AuthRequest;
      const submission = await AssignmentService.getSubmissionById(
        id,
        authReq.user.tenantId,
        { userId: authReq.user.id, role: authReq.user.role },
      );

      res.json({
        success: true,
        data: submission,
      });
    } catch (error) {
      next(error);
    }
  }

  static async gradeSubmission(req: Request, res: Response, next: NextFunction) {
    try {
      const authReq = req as AuthRequest;
      const { id } = req.params;
      const validated = gradeSubmissionSchema.parse(req.body);

      const submission = await AssignmentService.gradeSubmission(id, authReq.user.tenantId, {
        ...validated,
        feedback: validated.feedback ?? '',
        gradedBy: authReq.user.id,
      });

      res.json({
        success: true,
        data: submission,
        message: 'Submission graded successfully!',
      });
    } catch (error) {
      next(error);
    }
  }

  // ============ Gradebook ============

  static async getGradebook(req: Request, res: Response, next: NextFunction) {
    try {
      const authReq = req as AuthRequest;
      const { studentId, academicYearId } = req.params;
      if (authReq.user.role === 'student') {
        const student = await Student.findOne({
          userId: authReq.user.id,
          tenantId: authReq.user.tenantId,
          isDeleted: false,
        }).select('_id');
        if (!student || student._id.toString() !== studentId) {
          throw new AppError('You may only view your own gradebook', 403);
        }
      }

      const gradebook = await AssignmentService.getGradebook(
        authReq.user.tenantId,
        studentId,
        academicYearId
      );

      res.json({
        success: true,
        data: gradebook,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getStudentProgress(req: Request, res: Response, next: NextFunction) {
    try {
      const authReq = req as AuthRequest;
      const { studentId, academicYearId } = req.params;
      if (authReq.user.role === 'student') {
        const student = await Student.findOne({
          userId: authReq.user.id,
          tenantId: authReq.user.tenantId,
          isDeleted: false,
        }).select('_id');
        if (!student || student._id.toString() !== studentId) {
          throw new AppError('You may only view your own progress', 403);
        }
      }

      const progress = await AssignmentService.getStudentProgress(
        authReq.user.tenantId,
        studentId,
        academicYearId
      );

      res.json({
        success: true,
        data: progress,
      });
    } catch (error) {
      next(error);
    }
  }

  // ============ Report Cards ============

  static async generateReportCard(req: Request, res: Response, next: NextFunction) {
    try {
      const authReq = req as AuthRequest;
      const validated = generateReportCardSchema.parse(req.body);

      const reportCard = await AssignmentService.generateReportCard(
        authReq.user.tenantId,
        {
          ...validated,
          createdBy: authReq.user.id,
        }
      );

      res.status(201).json({
        success: true,
        data: reportCard,
        message: 'Report card generated successfully!',
      });
    } catch (error) {
      next(error);
    }
  }

  static async getReportCards(req: Request, res: Response, next: NextFunction) {
    try {
      const authReq = req as AuthRequest;
      const { studentId, academicYearId, term, status, page: rawPage, limit: rawLimit } = req.query;
      const pagination = parsePagination(rawPage, rawLimit);
      let scopedStudentId = studentId as string;
      if (authReq.user.role === 'student') {
        const student = await Student.findOne({
          userId: authReq.user.id,
          tenantId: authReq.user.tenantId,
          isDeleted: false,
        }).select('_id');
        if (!student) throw new AppError('Student profile not found', 404);
        scopedStudentId = student._id.toString();
      }
      let linkedStudentIds: string[] | undefined;
      if (authReq.user.role === 'guardian') {
        const linkedStudents = await Student.find({
          tenantId: authReq.user.tenantId,
          'guardians.userId': authReq.user.id,
          isDeleted: false,
        }).select('_id');
        linkedStudentIds = linkedStudents.map(student => student._id.toString());
        if (studentId && !linkedStudentIds.includes(studentId as string)) {
          throw new AppError('You are not linked to this student', 403);
        }
      }

      const result = await AssignmentService.getReportCards(
        authReq.user.tenantId,
        {
          studentId: scopedStudentId,
          studentIds: studentId ? undefined : linkedStudentIds,
          academicYearId: academicYearId as string,
          term: term as string,
          status: status as string,
          ...pagination,
        }
      );

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getReportCardById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const authReq = req as AuthRequest;
      const reportCard = await AssignmentService.getReportCardById(id, authReq.user.tenantId);
      const studentRef = reportCard.studentId as unknown as { _id?: string } | string;
      const reportStudentId =
        typeof studentRef === 'object' && studentRef
          ? String(studentRef._id)
          : studentRef;

      if (authReq.user.role === 'student') {
        const student = await Student.findOne({
          _id: reportStudentId,
          userId: authReq.user.id,
          tenantId: authReq.user.tenantId,
          isDeleted: false,
        }).select('_id');
        if (!student) throw new AppError('You may only view your own report card', 403);
      } else if (authReq.user.role === 'guardian') {
        const linked = await Student.exists({
          _id: reportStudentId,
          tenantId: authReq.user.tenantId,
          'guardians.userId': authReq.user.id,
          isDeleted: false,
        });
        if (!linked) throw new AppError('You are not linked to this student', 403);
      }

      res.json({
        success: true,
        data: reportCard,
      });
    } catch (error) {
      next(error);
    }
  }

  static async publishReportCard(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const reportCard = await AssignmentService.publishReportCard(id, (req as AuthRequest).user.tenantId);

      res.json({
        success: true,
        data: reportCard,
        message: 'Report card published successfully!',
      });
    } catch (error) {
      next(error);
    }
  }
}