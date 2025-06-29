import { Request, Response, NextFunction } from 'express';
import { PrismaClient, ProjectStatus, Priority } from '@prisma/client';

const prisma = new PrismaClient();

// Create Project (Staff/Admin only)
export const createProject = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { title, description, status, priority, dueDate, staffId } = req.body;

    if (!title) {
      res.status(400).json({
        error: 'Missing required fields',
        message: 'Title is required'
      });
      return;
    }

    // If staffId is provided, verify the user exists and is a staff
    if (staffId) {
      const assignedStaff = await prisma.user.findUnique({
        where: { id: staffId }
      });

      if (!assignedStaff || assignedStaff.role !== 'STAFF') {
        res.status(400).json({
          error: 'Invalid staff assignment',
          message: 'Assigned user must be a staff member'
        });
        return;
      }
    }

    const project = await prisma.project.create({
      data: {
        title,
        description,
        status: status || 'PLANNING',
        priority: priority || 'MEDIUM',
        dueDate: dueDate ? new Date(dueDate) : null,
        staffId: staffId || req.user!.id, // Assign to current user if no staffId provided
        createdById: req.user!.id,
        lastEditedById: req.user!.id,
      },
      include: {
        staff: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        },
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        lastEditedBy: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    res.status(201).json({
      message: 'Project created successfully',
      project
    });
  } catch (error) {
    console.error('Create project error:', error);
    next(error);
  }
};

// Get All Projects (Public access)
export const getAllProjects = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { status, priority, search } = req.query;
    
    const where: any = {};
    
    if (status) where.status = status;
    if (priority) where.priority = priority;
    if (search) {
      where.OR = [
        { title: { contains: search as string, mode: 'insensitive' } },
        { description: { contains: search as string, mode: 'insensitive' } }
      ];
    }

    const projects = await prisma.project.findMany({
      where,
      include: {
        staff: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        },
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        lastEditedBy: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        _count: {
          select: {
            comments: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json({
      projects,
      count: projects.length
    });
  } catch (error) {
    console.error('Get projects error:', error);
    next(error);
  }
};

// Get Project by ID (Public access)
export const getProjectById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        staff: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        },
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        lastEditedBy: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        comments: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                role: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    });

    if (!project) {
      res.status(404).json({
        error: 'Project not found',
        message: 'Project does not exist'
      });
      return;
    }

    res.json({ project });
  } catch (error) {
    console.error('Get project error:', error);
    next(error);
  }
};

// Update Project (Staff can update their projects, Admin can update any)
export const updateProject = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, description, status, priority, dueDate, staffId } = req.body;

    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        staff: true
      }
    });

    if (!project) {
      res.status(404).json({
        error: 'Project not found',
        message: 'Project does not exist'
      });
      return;
    }

    // Check permissions
    if (req.user!.role !== 'ADMIN' && project.staffId !== req.user!.id) {
      res.status(403).json({
        error: 'Access denied',
        message: 'You can only edit projects assigned to you'
      });
      return;
    }

    // If changing staff assignment, verify the new staff exists
    if (staffId && staffId !== project.staffId) {
      const newStaff = await prisma.user.findUnique({
        where: { id: staffId }
      });

      if (!newStaff || newStaff.role !== 'STAFF') {
        res.status(400).json({
          error: 'Invalid staff assignment',
          message: 'Assigned user must be a staff member'
        });
        return;
      }
    }

    const updatedProject = await prisma.project.update({
      where: { id },
      data: {
        title,
        description,
        status,
        priority,
        dueDate: dueDate ? new Date(dueDate) : null,
        staffId,
        lastEditedById: req.user!.id,
      },
      include: {
        staff: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        },
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        lastEditedBy: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    res.json({
      message: 'Project updated successfully',
      project: updatedProject
    });
  } catch (error) {
    console.error('Update project error:', error);
    next(error);
  }
};

// Delete Project (Admin only)
export const deleteProject = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const project = await prisma.project.findUnique({
      where: { id }
    });

    if (!project) {
      res.status(404).json({
        error: 'Project not found',
        message: 'Project does not exist'
      });
      return;
    }

    await prisma.project.delete({
      where: { id }
    });

    res.json({
      message: 'Project deleted successfully'
    });
  } catch (error) {
    console.error('Delete project error:', error);
    next(error);
  }
};

// Get Projects by Staff (for staff dashboard)
export const getProjectsByStaff = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const staffId = req.params.staffId || req.user!.id;

    // Check if user can access these projects
    if (req.user!.role !== 'ADMIN' && req.user!.id !== staffId) {
      res.status(403).json({
        error: 'Access denied',
        message: 'You can only view your own projects'
      });
      return;
    }

    const projects = await prisma.project.findMany({
      where: { staffId },
      include: {
        staff: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        },
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        lastEditedBy: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        _count: {
          select: {
            comments: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json({
      projects,
      count: projects.length
    });
  } catch (error) {
    console.error('Get staff projects error:', error);
    next(error);
  }
}; 