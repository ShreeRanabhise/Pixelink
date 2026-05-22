import express from 'express';
import { getSettings, updateSettings, updateLogo } from '../controllers/settingsController.js';
import { protect, adminOnly } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

router.route('/')
  .get(getSettings)
  .put(protect, adminOnly, updateSettings);

router.post('/logo', protect, adminOnly, upload.single('logo'), updateLogo);

export default router;
