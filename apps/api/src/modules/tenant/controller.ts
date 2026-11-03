import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { TenantService } from './service';
import { AppError } from '../../middleware/error-handler';
import { AuthRequest } from '../../middleware/auth';
import { isPlatformAdminEmail } from '../../utils/platform-admin';
import { config } from '../../config';
import { z } from 'zod';
import {
  sendSchoolPendingApprovalEmail,
} from '../../services/email.service';

/* ─────────────────────────────────────────────────────────────
   Validation schemas
   ───────────────────────────────────────────────────────────── */

const createTenantSchema = z.object({
  name: z.string().min(1),
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens'),
  address: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  logoUrl: z.string().url().optional(),
  settings: z
    .object({
      domain: z.string().optional(),
      academicYearStart: z.string().optional(),
      academicYearEnd: z.string().optional(),
      timezone: z.string().optional(),
      currency: z.string().optional(),
      language: z.string().optional(),
      emailDomain: z.string().optional(),
      affiliation: z.string().optional(),
      affiliationNumber: z.string().optional(),
    })
    .optional(),
});

const updateTenantSchema = z.object({
  name: z.string().min(1).optional(),
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9-]+$/)
    .optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  logoUrl: z.string().url().optional(),
  status: z
    .enum(['pending', 'active', 'suspended', 'rejected', 'inactive', 'archived'])
    .optional(),
  settings: z
    .object({
      domain: z.string().optional(),
      academicYearStart: z.string().optional(),
      academicYearEnd: z.string().optional(),
      timezone: z.string().optional(),
      currency: z.string().optional(),
      language: z.string().optional(),
      emailDomain: z.string().optional(),
      affiliation: z.string().optional(),
      affiliationNumber: z.string().optional(),
    })
    .optional(),
});

const listTenantsSchema = z.object({
  limit: z.coerce.number().min(1).max(100).optional(),
  offset: z.coerce.number().min(0).optional(),
  status: z
    .enum(['pending', 'active', 'suspended', 'rejected', 'inactive', 'archived'])
    .optional(),
  search: z.string().optional(),
});

const createSchoolSchema = z.object({
  name: z.string().min(1, 'School name is required'),
  slug: z.string().optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  affiliation: z.string().optional(),
  affiliationNumber: z.string().optional(),

  // Administrator registration fields
  adminFirstName: z.string().min(1, 'Administrator first name is required'),
  adminLastName: z.string().min(1, 'Administrator last name is required'),
  adminEmail: z.string().email('Valid administrator email is required'),
  adminPassword: z.string().min(8, 'Password must be at least 8 characters long'),
  adminPhone: z.string().optional(),
  adminDesignation: z.string().optional(),
});

/* ─────────────────────────────────────────────────────────────
   Controller
   ───────────────────────────────────────────────────────────── */

export class TenantController {
  /* ═══════════════════════════════════════════════════════════
     SCHOOL CREATION — PUBLIC, RATE-LIMITED
     Creates a `pending` tenant and initial pending admin user.
     ═══════════════════════════════════════════════════════════ */

  static async createSchool(req: Request, res: Response, next: NextFunction) {
    try {
      const validated = createSchoolSchema.parse(req.body);

      const tenant = await TenantService.createSchool({
        ...validated,
        registrationIp: req.ip || req.socket.remoteAddress || '',
        registrationUserAgent: req.get('user-agent') || '',
      });

      console.log('✅ School & Admin created (pending):', {
        id: tenant.id,
        name: tenant.name,
        adminEmail: tenant.admin?.email,
      });

      // ── Notify platform admin ──
      if (config.platformAdmin.email) {
        const reviewLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/platform-admin/schools/pending`;
        try {
          await sendSchoolPendingApprovalEmail(
            config.platformAdmin.email,
            tenant.name,
            tenant.email || tenant.admin?.email || 'N/A',
            tenant.phone || 'N/A',
            reviewLink,
          );
          console.log(
            `📧 School pending notification sent to platform admin: ${config.platformAdmin.email}`,
          );
        } catch (emailErr) {
          console.error(
            'Failed to notify platform admin of pending school:',
            emailErr,
          );
        }
      }

      res.status(201).json({
        success: true,
        data: tenant,
        message:
          'School registration submitted successfully! Please check your email to verify your administrator account.',
      });
    } catch (error) {
      next(error);
    }
  }

  /* ═══════════════════════════════════════════════════════════
     EMAIL VERIFICATION
     ═══════════════════════════════════════════════════════════ */

  static async verifySchoolEmail(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { token } = req.params;
      const result = await TenantService.verifySchoolEmail(token);
      res.json({
        success: true,
        data: result,
        message: 'Email verified successfully. Your school is awaiting platform approval.',
      });
    } catch (error) {
      next(error);
    }
  }

  /* ═══════════════════════════════════════════════════════════
     LOOKUPS
     ═══════════════════════════════════════════════════════════ */

  static async getBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const tenant = await TenantService.getBySlug(req.params.slug);
      res.json({
        success: true,
        data: tenant,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getPublicInfo(req: Request, res: Response, next: NextFunction) {
    try {
      const tenant = await TenantService.getPublicInfo(req.params.slug);
      res.json({
        success: true,
        data: tenant,
      });
    } catch (error) {
      next(error);
    }
  }

  static async validateTenant(req: Request, res: Response, next: NextFunction) {
    try {
      const { tenantId } = req.params;
      const isValid = await TenantService.validateTenant(tenantId);
      res.json({
        success: true,
        data: { isValid },
      });
    } catch (error) {
      next(error);
    }
  }

  static async hasAdmin(req: Request, res: Response, next: NextFunction) {
    try {
      const { tenantId } = req.params;
      const hasAdmin = await TenantService.hasAdmin(tenantId);
      res.json({
        success: true,
        data: { hasAdmin },
      });
    } catch (error) {
      next(error);
    }
  }

  static async getPublicCurrent(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const tenantId =
        (req.headers['x-tenant-id'] as string) ||
        req.cookies?.acadflows_tenant_id ||
        (req.query.tenantId as string);

      if (!tenantId) {
        return res.status(404).json({
          success: false,
          error: 'No tenant identifier provided',
          data: null,
        });
      }

      let tenant: any = null;
      try {
        if (mongoose.Types.ObjectId.isValid(tenantId)) {
          tenant = await TenantService.getById(tenantId);
        } else {
          tenant = await TenantService.getBySlug(tenantId);
        }
      } catch (error) {
        next(error);
        return;
      }

      if (!tenant) {
        return res.status(404).json({
          success: false,
          error: 'Tenant not found',
          data: null,
        });
      }

      const tenantObj = {
        ...tenant,
        id: tenant._id || tenant.id,
        _id: tenant._id || tenant.id,
      };

      console.log('✅ Public tenant found:', tenantObj.name);

      res.json({
        success: true,
        data: tenantObj,
      });
    } catch (error) {
      console.error('❌ Error getting public tenant:', error);
      res.status(404).json({
        success: false,
        error: 'Tenant not found',
        data: null,
      });
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const auth = (req as AuthRequest).user;
      const tenantId = auth && isPlatformAdminEmail(auth.email)
        ? undefined
        : auth?.tenantId;
      const tenant = await TenantService.getById(req.params.id, tenantId);
      res.json({
        success: true,
        data: tenant,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getCurrentTenant(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = (req as Request & { tenantId?: string }).tenantId;

      if (!tenantId) {
        throw new AppError('No tenant context found', 404);
      }

      const tenant = await TenantService.getById(tenantId);

      res.json({
        success: true,
        data: tenant,
      });
    } catch (error) {
      next(error);
    }
  }

  /* ═══════════════════════════════════════════════════════════
     ADMIN-ONLY CRUD
     ═══════════════════════════════════════════════════════════ */

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const validated = createTenantSchema.parse(req.body);
      const tenant = await TenantService.create(validated);
      res.status(201).json({
        success: true,
        data: tenant,
        message: 'School created successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const validated = updateTenantSchema.parse(req.body);
      const auth = (req as AuthRequest).user;
      const tenantId = auth && isPlatformAdminEmail(auth.email)
        ? undefined
        : auth?.tenantId;
      const tenant = await TenantService.update(req.params.id, validated, tenantId);
      res.json({
        success: true,
        data: tenant,
        message: 'School updated successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const validated = listTenantsSchema.parse(req.query);
      const auth = (req as AuthRequest).user;
      const options = auth && isPlatformAdminEmail(auth.email)
        ? validated
        : { ...validated, tenantId: auth?.tenantId };

      const result = await TenantService.list(options);
      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}
