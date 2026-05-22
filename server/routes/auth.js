import express from 'express';
import { login, updateProfile } from '../controllers/authController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.post('/login', login);
router.put('/profile', protect, adminOnly, updateProfile);

export default router;
