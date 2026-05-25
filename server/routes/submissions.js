import express from 'express';
import {
  createSubmission,
  getSubmissions,
  updateSubmissionStatus,
  bulkUpdateSubmissions,
} from '../controllers/submissionController.js';
import { protect, adminOnly } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

router.post('/', upload.single('image'), createSubmission);
router.get('/', protect, adminOnly, getSubmissions);
router.post('/bulk', protect, adminOnly, bulkUpdateSubmissions);
router.put('/:id', protect, adminOnly, updateSubmissionStatus);

export default router;
