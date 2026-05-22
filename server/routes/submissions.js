import express from 'express';
import {
  createSubmission,
  getSubmissions,
  updateSubmissionStatus,
} from '../controllers/submissionController.js';
import { protect, adminOnly } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

router.post('/', upload.single('image'), createSubmission);
router.get('/', protect, adminOnly, getSubmissions);
router.put('/:id', protect, adminOnly, updateSubmissionStatus);

export default router;
