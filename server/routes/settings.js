import express from 'express';
import { getSettings, updateSettings, updateLogo, getSystemHealth } from '../controllers/settingsController.js';
import { protect, authorizeRoles } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

router.get('/health', protect, authorizeRoles('admin'), getSystemHealth);

router.route('/')
  .get(getSettings)
  .put(protect, authorizeRoles('admin'), updateSettings);

router.post('/logo', protect, authorizeRoles('admin'), upload.single('logo'), updateLogo);

export default router;
