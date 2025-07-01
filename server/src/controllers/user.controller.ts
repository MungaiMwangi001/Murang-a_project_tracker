import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../utils/password.utils';

const prisma = new PrismaClient();

// Get All Users (Admin only)
export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            projects: true,
            comments: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json({
      users,
      count: users.length
    });
  } catch (error) {
    console.error('Get users error:', error);
    next(error);
  }
};

// Get User by ID (Admin only)
export const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        projects: {
          select: {
            id: true,
            title: true,
            status: true,
            createdAt: true
          }
        },
        comments: {
          select: {
            id: true,
            content: true,
            createdAt: true,
            project: {
              select: {
                id: true,
                title: true
              }
            }
          }
        },
        _count: {
          select: {
            projects: true,
            comments: true
          }
        }
      }
    });

    if (!user) {
      res.status(404).json({
        error: 'User not found',
        message: 'User does not exist'
      });
      return;
    }

    res.json({ user });
  } catch (error) {
    console.error('Get user error:', error);
    next(error);
  }
};

// Create User (Admin only)
export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      res.status(400).json({
        error: 'Missing required fields',
        message: 'Name, email, password, and role are required'
      });
      return;
    }

    // Validate role
    const validRoles = ['PUBLIC', 'STAFF', 'ADMIN'];
    if (!validRoles.includes(role)) {
      res.status(400).json({
        error: 'Invalid role',
        message: 'Role must be PUBLIC, STAFF, or ADMIN'
      });
      return;
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      res.status(409).json({
        error: 'User already exists',
        message: 'A user with this email already exists'
      });
      return;
    }

    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role as any
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
      message: 'User created successfully',
      user
    });
  } catch (error) {
    console.error('Create user error:', error);
    next(error);
  }
};

// Update User (Admin only)
export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, email, role } = req.body;

    const user = await prisma.user.findUnique({
      where: { id }
    });

    if (!user) {
      res.status(404).json({
        error: 'User not found',
        message: 'User does not exist'
      });
      return;
    }

    // Validate role if provided
    if (role) {
      const validRoles = ['PUBLIC', 'STAFF', 'ADMIN'];
      if (!validRoles.includes(role)) {
        res.status(400).json({
          error: 'Invalid role',
          message: 'Role must be PUBLIC, STAFF, or ADMIN'
        });
        return;
      }
    }

    // Check if email is being changed and if it already exists
    if (email && email !== user.email) {
      const existingUser = await prisma.user.findUnique({
        where: { email }
      });

      if (existingUser) {
        res.status(409).json({
          error: 'Email already exists',
          message: 'A user with this email already exists'
        });
        return;
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        name,
        email,
        role: role as any
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    });

    res.json({
      message: 'User updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Update user error:', error);
    next(error);
  }
};

// Delete User (Admin only)
export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id }
    });

    if (!user) {
      res.status(404).json({
        error: 'User not found',
        message: 'User does not exist'
      });
      return;
    }

    // Prevent admin from deleting themselves
    if (req.user!.id === id) {
      res.status(400).json({
        error: 'Cannot delete self',
        message: 'You cannot delete your own account'
      });
      return;
    }

    await prisma.user.delete({
      where: { id }
    });

    res.json({
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    next(error);
  }
};

// Get Staff Members (Admin only)
export const getStaffMembers = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const staffMembers = await prisma.user.findMany({
      where: {
        role: 'STAFF'
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        _count: {
          select: {
            projects: true
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    });

    res.json({
      staffMembers,
      count: staffMembers.length
    });
  } catch (error) {
    console.error('Get staff members error:', error);
    next(error);
  }
};

// Admin: Approve a staff user
export const approveStaff = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      res.status(404).json({ error: 'User not found', message: 'No user with this ID' });
      return;
    }
    if (user.role !== 'STAFF') {
      res.status(400).json({ error: 'Not a staff user', message: 'Only staff users can be approved' });
      return;
    }
    if (user.isApproved) {
      res.status(200).json({ message: 'Staff user is already approved', user });
      return;
    }
    const updatedUser = await prisma.user.update({
      where: { id },
      data: { isApproved: true },
    });
    res.status(200).json({ message: 'Staff user approved successfully', user: updatedUser });
  } catch (error) {
    console.error('Approve staff error:', error);
    next(error);
  }
}; 