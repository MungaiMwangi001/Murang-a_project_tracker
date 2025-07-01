import { Router } from 'express';
import {
  createComment,
  getCommentsByProject,
  updateComment,
  deleteComment,
  getCommentsByUser
} from '../controllers/comment.controller';
import { verifyToken } from '../middleware/auth.middleware';

const router = Router();

// Public routes: no authentication required
router.get('/projects/:projectId', getCommentsByProject);
router.post('/', createComment); // Allow public comments

// Protected routes: require authentication
router.get('/users/:userId', verifyToken, getCommentsByUser);
router.put('/:id', verifyToken, updateComment);
router.delete('/:id', verifyToken, deleteComment);

export default router; 