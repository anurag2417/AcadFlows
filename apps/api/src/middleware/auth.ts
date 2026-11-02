import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import type { TenantRequest } from './tenant-context';
import { User } from '../models/User';
import { Tenant } from '../models/Tenant';
import { isPlatformAdminEmail } from '../utils/platform-admin';

export interface AuthRequest extends Request {
  user: {
    id: string;
    tenantId: string;
    email: string;
    role: string;
  };
}

export async function authenticate(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required',
      });
    }

    const decoded = jwt.verify(token, config.jwt.secret) as {
      userId: string;
      tenantId: string;
      email: string;
      role: string;
    };

    const user = await User.findById(decoded.userId).select(
      'status email role tenantId',
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid token',
      });
    }

    const platformAdmin = isPlatformAdminEmail(user.email);
    if (!platformAdmin) {
      const tenant = await Tenant.findOne({ _id: user.tenantId }).select('status');
      if (!tenant || tenant.status !== 'active') {
        return res.status(403).json({ success: false, error: 'School is not active' });
      }
    }
    if (!platformAdmin && user.status !== 'active') {
      return res.status(403).json({
        success: false,
        error: 'Account is not active',
      });
    }

    (req as AuthRequest).user = {
      id: user.id,
      tenantId: user.tenantId,
      email: user.email,
      role: user.role,
    };

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({
        success: false,
        error: 'Token expired',
      });
    }
    return res.status(401).json({
      success: false,
      error: 'Invalid token',
    });
  }
}

export function requireRole(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const authReq = req as AuthRequest;

    if (!authReq.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required',
      });
    }

    if (!roles.includes(authReq.user.role)) {
      return res.status(403).json({
        success: false,
        error: 'Insufficient permissions',
      });
    }

    next();
  };
}

export async function ensureTenantMatch(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const authReq = req as AuthRequest;
  const tenantReq = req as TenantRequest;

  if (!authReq.user?.tenantId) {
    return res.status(401).json({
      success: false,
      error: 'Authentication required',
    });
  }

  if (!tenantReq.tenantId) {
    const tenant = await Tenant.findOne({
      _id: authReq.user.tenantId,
      status: 'active',
    });

    if (tenant) {
      tenantReq.tenantId = tenant.id;
      tenantReq.tenant = tenant;
    }
  }

  if (!tenantReq.tenantId) {
    return res.status(400).json({
      success: false,
      error: 'Active tenant context is required for your account',
    });
  }

  if (authReq.user.tenantId !== tenantReq.tenantId) {
    return res.status(403).json({
      success: false,
      error: 'Tenant mismatch — the requested tenant does not match your session',
    });
  }

  next();
}
