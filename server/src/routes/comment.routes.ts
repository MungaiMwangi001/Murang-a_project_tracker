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

// Public route: get comments for a project
router.get('/projects/:projectId', getCommentsByProject);

// Public route: get comments by user (for user dashboard, but can be protected if needed)
router.get('/users/:userId', verifyToken, getCommentsByUser);

// Protected routes: require authentication
router.use(verifyToken);

router.post('/', createComment);
router.put('/:id', updateComment);
router.delete('/:id', deleteComment);

export default router; 