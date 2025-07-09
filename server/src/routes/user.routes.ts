import { Router } from 'express';
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getStaffMembers,
  getPendingUsers,
  approveUser,
  rejectUser,
  approveStaff
} from '../controllers/user.controller';
import { verifyToken, } from '../middleware/auth.middleware';
import { requireAdmin } from '../middleware/auth.middleware';

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
router.get('/users/pending', requireAdmin, getPendingUsers);
router.put('/users/:id/approve', requireAdmin, approveUser);
router.delete('/users/:id/reject', requireAdmin, rejectUser);



export default router; 