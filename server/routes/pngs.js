import express from 'express';
import {
  getPngs,
  getMyUploads,
  getPngBySlug,
  createPng,
  updatePng,
  deletePng,
  incrementDownloads,
  incrementLikes,
  getGlobalStats,
  getSimilarPngs,
} from '../controllers/pngController.js';
import { protect, authorizeRoles } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

router.get('/', getPngs);
router.get('/stats/global', protect, authorizeRoles('admin'), getGlobalStats);
router.get('/my-uploads', protect, authorizeRoles('admin', 'creator'), getMyUploads);
router.get('/:slug', getPngBySlug);
router.get('/:id/similar', getSimilarPngs);
router.post('/', protect, authorizeRoles('admin', 'creator'), upload.single('image'), createPng);
router.put('/:id', protect, authorizeRoles('admin', 'creator'), updatePng);
router.delete('/:id', protect, authorizeRoles('admin', 'creator'), deletePng);
router.post('/:id/download', incrementDownloads);
router.post('/:id/like', incrementLikes);

export default router;
