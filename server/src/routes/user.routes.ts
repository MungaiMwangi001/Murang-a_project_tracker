import { Router } from 'express';
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getStaffMembers,
  approveStaff
} from '../controllers/user.controller';
import { verifyToken, requireAdmin } from '../middleware/auth.middleware';

const router = Router();

// All user routes require authentication and admin role
router.use(verifyToken);
router.use(requireAdmin);

router.get('/', getAllUsers);
router.get('/staff', getStaffMembers);
router.get('/:id', getUserById);
router.post('/', createUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);
router.put('/:id/approve', approveStaff);

export default router; 