import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Extend Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: string;
        isApproved: boolean;
      };
    }
  }
}

// JWT Verification Middleware
export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        error: 'Access denied',
        message: 'No token provided'
      });
      return;
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET) as {
      id: string;
      email: string;
      role: string;
    };

    // Verify user still exists in database
    const user = await prisma.user.findUnique({
      where: { id: decoded.id }
    });

    if (!user) {
      res.status(401).json({
        error: 'Invalid token',
        message: 'User no longer exists'
      });
      return;
    }

    // Attach all relevant user info, including isApproved, to req.user
    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
      isApproved: user.isApproved,
    };
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({
      error: 'Invalid token',
      message: 'Token is invalid or expired'
    });
  }
};

// Role-based Authorization Middleware
export const requireRole = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        error: 'Access denied',
        message: 'Authentication required'
      });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        error: 'Access denied',
        message: 'Insufficient permissions'
      });
      return;
    }

    next();
  };
};

// Specific role middlewares
export const requireAdmin = requireRole(['ADMIN']);
export const requireStaff = requireRole(['STAFF', 'ADMIN']);
export const requirePublic = requireRole(['PUBLIC', 'STAFF', 'ADMIN']);

// Project ownership middleware (for staff)
export const requireProjectOwnership = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const projectId = req.params.id || req.body.projectId;
    
    if (!projectId) {
      res.status(400).json({
        error: 'Missing project ID',
        message: 'Project ID is required'
      });
      return;
    }

    const project = await prisma.project.findUnique({
      where: { id: projectId }
    });

    if (!project) {
      res.status(404).json({
        error: 'Project not found',
        message: 'Project does not exist'
      });
      return;
    }

    // Admin can access any project
    if (req.user?.role === 'ADMIN') {
      next();
      return;
    }

    // Staff can only access their assigned projects
    if (req.user?.role === 'STAFF' && project.staffId === req.user.id) {
      next();
      return;
    }

    res.status(403).json({
      error: 'Access denied',
      message: 'You can only access projects assigned to you'
    });
  } catch (error) {
    console.error('Project ownership check error:', error);
    res.status(500).json({
      error: 'Server error',
      message: 'Failed to verify project ownership'
    });
  }
}; 