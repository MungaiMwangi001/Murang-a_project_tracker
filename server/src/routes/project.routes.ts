import { Router } from 'express';
import {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
  getProjectsByStaff
} from '../controllers/project.controller';
import {
  verifyToken,
  requireStaff,
  requireAdmin,
  requireProjectOwnership
} from '../middleware/auth.middleware';

const router = Router();

// Public routes (no authentication required)
router.get('/', getAllProjects);
router.get('/:id', getProjectById);

// Protected routes (authentication required)
router.use(verifyToken); // Apply JWT verification to all routes below

// Staff/Admin routes
router.post('/', requireStaff, createProject);
router.put('/:id', requireProjectOwnership, updateProject);
router.get('/staff/projects', requireStaff, getProjectsByStaff);
router.get('/staff/:staffId/projects', requireStaff, getProjectsByStaff);

// Admin only routes
router.delete('/:id', requireProjectOwnership, deleteProject);

export default router; 