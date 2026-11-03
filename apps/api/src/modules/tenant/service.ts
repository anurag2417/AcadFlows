import mongoose from 'mongoose';
import crypto from 'crypto';
import { Tenant } from '../../models/Tenant';
import { User } from '../../models/User';
import { AppError } from '../../middleware/error-handler';
import { Tenant as TenantType } from '@acadflows/shared';
import { sendSchoolVerificationEmail } from '../../services/email.service';

export class TenantService {
  /* ═══════════════════════════════════════════════════════════
     CREATE — admin-created tenant (internal/platform admin)
     ═══════════════════════════════════════════════════════════ */

  static async create(data: Partial<TenantType>): Promise<any> {
    if (!data.name || !data.slug) {
      throw new AppError('Name and slug are required', 400);
    }

    const existingSlug = await Tenant.findOne({ slug: data.slug });
    if (existingSlug) {
      throw new AppError('Tenant with this slug already exists', 409);
    }

    const tenant = await Tenant.create({
      ...data,
      status: 'active',
      emailVerified: true,
    });

    const tenantObj: any = tenant.toObject();
    tenantObj.id = tenant._id;

    return tenantObj;
  }

  /* ═══════════════════════════════════════════════════════════
     CREATE SCHOOL — public registration
     Creates pending tenant + pending admin user
     ═══════════════════════════════════════════════════════════ */

  static async createSchool(data: {
    name: string;
    slug?: string;
    address?: string;
    phone?: string;
    email?: string;
    affiliation?: string;
    affiliationNumber?: string;
    adminFirstName: string;
    adminLastName: string;
    adminEmail: string;
    adminPassword: string;
    adminPhone?: string;
    adminDesignation?: string;
    registrationIp?: string;
    registrationUserAgent?: string;
  }): Promise<any> {
    if (!data.name || !data.name.trim()) {
      throw new AppError('School name is required', 400);
    }
    if (!data.adminFirstName || !data.adminLastName) {
      throw new AppError('Administrator first and last name are required', 400);
    }
    if (!data.adminEmail) {
      throw new AppError('Administrator email is required', 400);
    }
    if (!data.adminPassword || data.adminPassword.length < 8) {
      throw new AppError('Password must be at least 8 characters long', 400);
    }

    const normalizedAdminEmail = data.adminEmail.toLowerCase().trim();

    // Check if user already exists with this email
    const existingUser = await User.findOne({ email: normalizedAdminEmail });
    if (existingUser) {
      throw new AppError(
        'An account with this administrator email already exists. Please log in or use another email.',
        409,
      );
    }

    // Generate slug from name if not provided
    let slug = data.slug;
    if (!slug) {
      slug = data.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
    }

    // Ensure slug is unique
    const existingSlug = await Tenant.findOne({ slug });
    if (existingSlug) {
      slug = `${slug}-${Math.floor(Math.random() * 1000)}`;
    }

    // Generate email verification token (48h expiry)
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpiresAt = new Date(
      Date.now() + 48 * 60 * 60 * 1000,
    );

    const tenant = await Tenant.create({
      name: data.name.trim(),
      slug,
      address: data.address?.trim() || '',
      phone: data.phone?.trim() || data.adminPhone?.trim() || '',
      email: data.email?.toLowerCase().trim() || normalizedAdminEmail,
      status: 'pending',
      emailVerified: false,
      verificationToken,
      verificationTokenExpiresAt,
      registrationIp: data.registrationIp,
      registrationUserAgent: data.registrationUserAgent,
      settings: {
        affiliation: data.affiliation?.trim() || '',
        affiliationNumber: data.affiliationNumber?.trim() || '',
      },
    });

    // Create the school administrator in pending state (activated upon platform approval)
    const adminUser = await User.create({
      tenantId: tenant._id.toString(),
      email: normalizedAdminEmail,
      passwordHash: data.adminPassword, // hashed by User pre-save hook
      firstName: data.adminFirstName.trim(),
      lastName: data.adminLastName.trim(),
      role: 'admin',
      status: 'pending',
      phone: data.adminPhone?.trim() || data.phone?.trim() || '',
      emailVerified: false,
      bio: data.adminDesignation?.trim() || 'School Administrator',
    });

    const tenantObj: any = tenant.toObject();
    tenantObj.id = tenant._id;
    tenantObj.admin = {
      id: adminUser._id,
      email: adminUser.email,
      firstName: adminUser.firstName,
      lastName: adminUser.lastName,
      role: adminUser.role,
      status: adminUser.status,
    };

    // Send verification email to the administrator
    const frontendUrl =
      process.env.FRONTEND_URL || 'http://localhost:5173';
    const verifyLink = `${frontendUrl}/verify-school?token=${verificationToken}`;

    try {
      await sendSchoolVerificationEmail(
        normalizedAdminEmail,
        verifyLink,
        data.name,
        `${data.adminFirstName} ${data.adminLastName}`.trim(),
      );
      console.log(`📧 School verification email sent to ${normalizedAdminEmail}`);
    } catch (err) {
      console.error('Failed to send school verification email:', err);
    }

    console.log('🏫 School & Admin created (pending):', {
      id: tenant._id,
      name: tenant.name,
      adminId: adminUser._id,
      adminEmail: adminUser.email,
    });

    return tenantObj;
  }

  /* ═══════════════════════════════════════════════════════════
     VERIFY EMAIL
     ═══════════════════════════════════════════════════════════ */

  static async verifySchoolEmail(
    token: string,
  ): Promise<{ emailVerified: boolean }> {
    if (!token) {
      throw new AppError('Verification token is required', 400);
    }

    const tenant = await Tenant.findOne({
      verificationToken: token,
      emailVerified: false,
    });

    if (!tenant) {
      throw new AppError(
        'Invalid or already-used verification token',
        400,
      );
    }

    if (
      tenant.verificationTokenExpiresAt &&
      tenant.verificationTokenExpiresAt < new Date()
    ) {
      throw new AppError('Verification token has expired', 400);
    }

    tenant.emailVerified = true;
    tenant.verificationToken = undefined;
    tenant.verificationTokenExpiresAt = undefined;
    await tenant.save();

    // Also mark the admin user's email as verified
    await User.updateMany(
      { tenantId: tenant._id.toString(), role: 'admin' },
      { emailVerified: true },
    );

    console.log(`✅ Email verified for tenant ${tenant.name}`);

    return { emailVerified: true };
  }

  /* ═══════════════════════════════════════════════════════════
     GETTERS
     ═══════════════════════════════════════════════════════════ */

  static async getById(id: string, tenantId?: string): Promise<any> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError('Invalid tenant ID format', 400);
    }

    const tenant = await Tenant.findOne({
      _id: id,
      ...(tenantId ? { _id: tenantId } : {}),
    });
    if (!tenant) {
      throw new AppError('Tenant not found', 404);
    }

    const tenantObj: any = tenant.toObject();
    tenantObj.id = tenant._id;

    return tenantObj;
  }

  static async getBySlug(slug: string): Promise<any> {
    const tenant = await Tenant.findOne({ slug, status: 'active' });
    if (!tenant) {
      throw new AppError('Tenant not found', 404);
    }

    const tenantObj: any = tenant.toObject();
    tenantObj.id = tenant._id;

    return tenantObj;
  }

  /* ═══════════════════════════════════════════════════════════
     UPDATE
     ═══════════════════════════════════════════════════════════ */

  static async update(
    id: string,
    data: Partial<TenantType>,
    tenantId?: string,
  ): Promise<any> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError('Invalid tenant ID format', 400);
    }

    if (data.slug) {
      const existing = await Tenant.findOne({
        slug: data.slug,
        _id: { $ne: id },
      });
      if (existing) {
        throw new AppError('Tenant with this slug already exists', 409);
      }
    }

    const tenant = await Tenant.findOneAndUpdate(
      { _id: id, ...(tenantId ? { _id: tenantId } : {}) },
      { $set: data },
      { new: true, runValidators: true },
    );
    if (!tenant) {
      throw new AppError('Tenant not found', 404);
    }

    const tenantObj: any = tenant.toObject();
    tenantObj.id = tenant._id;

    return tenantObj;
  }

  /* ═══════════════════════════════════════════════════════════
     LIST
     ═══════════════════════════════════════════════════════════ */

  static async list(options: {
    limit?: number;
    offset?: number;
    status?: string;
    search?: string;
    tenantId?: string;
  }) {
    const filter: any = {};
    if (options.tenantId) filter._id = options.tenantId;
    if (options.status) {
      filter.status = options.status;
    }
    if (options.search) {
      filter.$or = [
        { name: { $regex: options.search, $options: 'i' } },
        { slug: { $regex: options.search, $options: 'i' } },
        { email: { $regex: options.search, $options: 'i' } },
      ];
    }

    const [tenants, total] = await Promise.all([
      Tenant.find(filter)
        .limit(options.limit || 20)
        .skip(options.offset || 0)
        .sort({ createdAt: -1 }),
      Tenant.countDocuments(filter),
    ]);

    return {
      items: tenants.map(t => {
        const obj: any = t.toObject();
        obj.id = t._id;
        return obj;
      }),
      total,
      limit: options.limit || 20,
      offset: options.offset || 0,
    };
  }

  /* ═══════════════════════════════════════════════════════════
     PUBLIC INFO
     ═══════════════════════════════════════════════════════════ */

  static async getPublicInfo(slug: string): Promise<any> {
    const tenant = await Tenant.findOne({ slug, status: 'active' });
    if (!tenant) {
      throw new AppError('Tenant not found', 404);
    }

    return {
      id: tenant._id,
      _id: tenant._id,
      name: tenant.name,
      slug: tenant.slug,
      logoUrl: tenant.logoUrl,
      settings: {
        affiliation: tenant.settings?.affiliation,
        currency: tenant.settings?.currency,
        timezone: tenant.settings?.timezone,
        language: tenant.settings?.language,
      },
    };
  }

  /* ═══════════════════════════════════════════════════════════
     VALIDATION HELPERS
     ═══════════════════════════════════════════════════════════ */

  static async validateTenant(tenantId: string): Promise<boolean> {
    if (!mongoose.Types.ObjectId.isValid(tenantId)) {
      return false;
    }
    const tenant = await Tenant.findOne({
      _id: tenantId,
      status: 'active',
    });
    return !!tenant;
  }

  static async hasAdmin(tenantId: string): Promise<boolean> {
    if (!mongoose.Types.ObjectId.isValid(tenantId)) {
      return false;
    }

    const admin = await User.findOne({
      tenantId,
      role: 'admin',
      status: 'active',
    });

    return !!admin;
  }
}
