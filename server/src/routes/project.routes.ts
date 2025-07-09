import { Router } from 'express';
import {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  getProjectsByStaff
} from '../controllers/project.controller';
import { verifyToken } from '../middleware/auth.middleware';

const router = Router();

// Public routes
router.get('/', getAllProjects);
router.get('/:id', getProjectById);

// Protected routes
router.post('/', verifyToken, createProject);
router.put('/:id', verifyToken, updateProject);
router.delete('/:id', verifyToken, deleteProject);
router.get('/staff/projects', verifyToken, getProjectsByStaff);

export default router;