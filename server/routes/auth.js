import express from 'express';
import { login, updateProfile } from '../controllers/authController.js';
import { protect, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

router.post('/login', login);
router.put('/profile', protect, authorizeRoles('admin', 'creator', 'inspector'), updateProfile);

export default router;
