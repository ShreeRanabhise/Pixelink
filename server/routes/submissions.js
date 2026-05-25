import express from 'express';
import {
  createSubmission,
  getSubmissions,
  updateSubmissionStatus,
  bulkUpdateSubmissions,
} from '../controllers/submissionController.js';
import { protect, authorizeRoles } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

router.post('/', upload.single('image'), createSubmission);
router.get('/', protect, authorizeRoles('admin', 'inspector'), getSubmissions);
router.post('/bulk', protect, authorizeRoles('admin', 'inspector'), bulkUpdateSubmissions);
router.put('/:id', protect, authorizeRoles('admin', 'inspector'), updateSubmissionStatus);

export default router;
