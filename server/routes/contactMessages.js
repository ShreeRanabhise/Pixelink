import express from 'express';
import {
  createMessage,
  getMessages,
  updateMessageStatus,
  deleteMessage,
  bulkUpdateMessages,
  bulkDeleteMessages
} from '../controllers/contactMessageController.js';
import { protect, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

// Public route to submit a message
router.post('/', createMessage);

// Protected Admin routes
router.use(protect);
router.use(authorizeRoles('admin', 'inspector'));

router.route('/')
  .get(getMessages);

// Bulk routes MUST come before /:id so 'bulk-status' isn't parsed as an ID
router.put('/bulk-status', bulkUpdateMessages);
router.post('/bulk-delete', bulkDeleteMessages);

router.route('/:id')
  .put(updateMessageStatus)
  .delete(deleteMessage);

export default router;
