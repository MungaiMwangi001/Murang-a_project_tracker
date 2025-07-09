import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Create Comment (All authenticated users can comment)
export const createComment = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { projectId, content, parentId, userName } = req.body;

    if (!projectId || !content) {
      res.status(400).json({
        error: 'Missing required fields',
        message: 'Project ID and content are required'
      });
      return;
    }

    // Verify project exists
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

    let commentData: any = {
      content,
      timestamp: new Date(),
      projectId,
      parentId: parentId || null,
      userName: '',
    };

    if (req.user) {
      commentData.userId = req.user.id;
      commentData.userName = (req.user as any).name || req.user.email;
    } else {
      if (!userName) {
        res.status(400).json({
          error: 'Missing userName',
          message: 'Name is required for public comments'
        });
        return;
      }
      commentData.userName = userName;
    }

    const comment = await prisma.comment.create({
      data: commentData,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            role: true
          }
        },
        project: {
          select: {
            id: true,
            title: true
          }
        },
        replies: true
      }
    });

    res.status(201).json({
      message: 'Comment created successfully',
      comment
    });
  } catch (error) {
    console.error('Create comment error:', error);
    next(error);
  }
};

// Get Comments by Project (Public access)
export const getCommentsByProject = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { projectId } = req.params;

    // Verify project exists
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

    // Fetch all comments for the project, including user and replies
    const allComments = await prisma.comment.findMany({
      where: { projectId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            role: true
          }
        },
      },
      orderBy: {
        createdAt: 'asc'
      }
    });

    // Build a map of comments by id
    const commentMap: { [key: string]: any } = {};
    allComments.forEach((comment: any) => {
      comment.replies = [];
      commentMap[comment.id] = comment;
    });

    // Build the nested structure
    const nestedComments: any[] = [];
    allComments.forEach((comment: any) => {
      if (comment.parentId) {
        if (commentMap[comment.parentId]) {
          commentMap[comment.parentId].replies.push(comment);
        }
      } else {
        nestedComments.push(comment);
      }
    });

    res.json({
      comments: nestedComments,
      count: allComments.length
    });
  } catch (error) {
    console.error('Get comments error:', error);
    next(error);
  }
};

// Update Comment (User can edit their own comments, Staff can edit comments on their projects, Admin can edit any)
export const updateComment = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    if (!content) {
      res.status(400).json({
        error: 'Missing required fields',
        message: 'Content is required'
      });
      return;
    }

    const comment = await prisma.comment.findUnique({
      where: { id },
      include: {
        project: {
          include: {
            staff: true
          }
        },
        user: true
      }
    });

    if (!comment) {
      res.status(404).json({
        error: 'Comment not found',
        message: 'Comment does not exist'
      });
      return;
    }

    // Check permissions
    const canEdit = 
      req.user!.role === 'ADMIN' ||
      comment.userId === req.user!.id ||
      (req.user!.role === 'STAFF' && comment.project.staffId === req.user!.id);

    if (!canEdit) {
      res.status(403).json({
        error: 'Access denied',
        message: 'You can only edit your own comments or comments on projects you manage'
      });
      return;
    }

    const updatedComment = await prisma.comment.update({
      where: { id },
      data: { content },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            role: true
          }
        },
        project: {
          select: {
            id: true,
            title: true
          }
        }
      }
    });

    res.json({
      message: 'Comment updated successfully',
      comment: updatedComment
    });
  } catch (error) {
    console.error('Update comment error:', error);
    next(error);
  }
};

// Delete Comment (User can delete their own comments, Staff can delete comments on their projects, Admin can delete any)
export const deleteComment = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const comment = await prisma.comment.findUnique({
      where: { id },
      include: {
        project: {
          include: {
            staff: true
          }
        },
        user: true
      }
    });

    if (!comment) {
      res.status(404).json({
        error: 'Comment not found',
        message: 'Comment does not exist'
      });
      return;
    }

    // Check permissions
    const canDelete = 
      req.user!.role === 'ADMIN' ||
      comment.userId === req.user!.id ||
      (req.user!.role === 'STAFF' && comment.project.staffId === req.user!.id);

    if (!canDelete) {
      res.status(403).json({
        error: 'Access denied',
        message: 'You can only delete your own comments or comments on projects you manage'
      });
      return;
    }

    await prisma.comment.delete({
      where: { id }
    });

    res.json({
      message: 'Comment deleted successfully'
    });
  } catch (error) {
    console.error('Delete comment error:', error);
    next(error);
  }
};

// Get Comments by User (for user dashboard)
export const getCommentsByUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.params.userId || req.user!.id;

    // Check if user can access these comments
    if (req.user!.role !== 'ADMIN' && req.user!.id !== userId) {
      res.status(403).json({
        error: 'Access denied',
        message: 'You can only view your own comments'
      });
      return;
    }

    const comments = await prisma.comment.findMany({
      where: { userId },
      include: {
        project: {
          select: {
            id: true,
            title: true,
            status: true
          }
        },
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
    });

    res.json({
      comments,
      count: comments.length
    });
  } catch (error) {
    console.error('Get user comments error:', error);
    next(error);
  }
}; 