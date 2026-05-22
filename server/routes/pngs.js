import express from 'express';
import {
  getPngs,
  getPngBySlug,
  createPng,
  updatePng,
  deletePng,
  incrementDownloads,
} from '../controllers/pngController.js';
import { protect, adminOnly } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

router.get('/', getPngs);
router.get('/:slug', getPngBySlug);
router.post('/', protect, adminOnly, upload.single('image'), createPng);
router.put('/:id', protect, adminOnly, updatePng);
router.delete('/:id', protect, adminOnly, deletePng);
router.post('/:id/download', incrementDownloads);

export default router;
