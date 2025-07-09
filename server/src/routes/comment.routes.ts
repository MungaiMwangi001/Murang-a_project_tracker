import { Router } from 'express';
import {
  createComment,
  getCommentsByProject,
  updateComment,
  deleteComment,
  getCommentsByUser
} from '../controllers/comment.controller';
import { verifyToken } from '../middleware/auth.middleware';
import rateLimit from 'express-rate-limit';

const router = Router();

// Rate limiter for public comment creation
const commentRateLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 5, // limit each IP to 5 comments per windowMs
  message: {
    error: 'Too many comments from this IP, please try again later.'
  }
});

// Public routes: no authentication required
router.get('/projects/:projectId', getCommentsByProject);
router.post('/', commentRateLimiter, createComment); // Allow public comments with rate limiting

// Protected routes: require authentication
router.get('/users/:userId', verifyToken, getCommentsByUser);
router.put('/:id', verifyToken, updateComment);
router.delete('/:id', verifyToken, deleteComment);

export default router; 