import { Request, Response, NextFunction } from 'express';
import { PrismaClient, Role } from '@prisma/client';
import { hashPassword, comparePassword } from '../utils/password.utils';
import { generateToken } from '../utils/jwt.utils';
import { RegisterData, LoginData } from '../types';

const prisma = new PrismaClient();

// Register Controller
export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, email, password, role } = req.body as RegisterData & { role?: string };

    if (!name || !email || !password) {
      res.status(400).json({
        error: 'Missing required fields',
        message: 'Name, email, and password are required',
      });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({
        error: 'Password too short',
        message: 'Password must be at least 6 characters long',
      });
      return;
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      res.status(409).json({
        error: 'User already exists',
        message: 'A user with this email already exists',
      });
      return;
    }

    // Only allow STAFF registration, not ADMIN
    let userRole = 'PUBLIC';
    let isApproved = false;
    if (role === 'STAFF') {
      userRole = 'STAFF';
      isApproved = false; // Must be approved by admin
    }

    const hashedPassword = await hashPassword(password);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: userRole as any,
        isApproved,
      },
    });

    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    res.status(201).json({
      message: userRole === 'STAFF' ? 'Staff registered successfully. Awaiting admin approval.' : 'User registered successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isApproved: user.isApproved,
        createdAt: user.createdAt,
      },
      token,
    });
  } catch (error) {
    console.error('Registration error:', error);
    next(error);
  }
};

// Login Controller
export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body as LoginData;

    if (!email || !password) {
      res.status(400).json({
        error: 'Missing credentials',
        message: 'Email and password are required',
      });
      return;
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !(await comparePassword(password, user.password))) {
      res.status(401).json({
        error: 'Invalid credentials',
        message: 'Email or password is incorrect',
      });
      return;
    }

    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    next(error);
  }
};

// Logout Controller
export const logoutUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // In a real application, you might want to blacklist the token
    // For now, we'll just send a success response
    res.json({
      message: 'Logout successful'
    });
  } catch (error) {
    console.error('Logout error:', error);
    next(error);
  }
};

// Create Initial Admin (for testing - remove in production)
export const createInitialAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Check if admin already exists
    const existingAdmin = await prisma.user.findFirst({
      where: { role: 'ADMIN' }
    });

    if (existingAdmin) {
      res.status(400).json({
        error: 'Admin already exists',
        message: 'An admin user already exists in the system'
      });
      return;
    }

    const hashedPassword = await hashPassword('admin123');

    const admin = await prisma.user.create({
      data: {
        name: 'System Admin',
        email: 'admin@muranga.gov.ke',
        password: hashedPassword,
        role: 'ADMIN' as any,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true
      }
    });

    res.status(201).json({
      message: 'Initial admin created successfully',
      admin
    });
  } catch (error) {
    console.error('Create admin error:', error);
    next(error);
  }
};