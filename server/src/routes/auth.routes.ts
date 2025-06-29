import { Router } from 'express';
import { registerUser, loginUser, logoutUser, createInitialAdmin } from '../controllers/auth.controller';
import { verifyToken } from '../middleware/auth.middleware';

const router = Router();

// ✅ Correct: Use post for registration
router.post('/register', registerUser);

// ✅ Correct: Use post for login
router.post('/login', loginUser);

// Logout (requires authentication)
router.post('/logout', verifyToken, logoutUser);

// Create initial admin (for testing - remove in production)
router.post('/create-admin', createInitialAdmin);

export default router;
