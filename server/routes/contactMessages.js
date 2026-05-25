import express from 'express';
import {
  createMessage,
  getMessages,
  updateMessageStatus,
  deleteMessage
} from '../controllers/contactMessageController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// Public route to submit a message
router.post('/', createMessage);

// Protected Admin routes
router.use(protect);
router.use(admin);

router.route('/')
  .get(getMessages);

router.route('/:id')
  .put(updateMessageStatus)
  .delete(deleteMessage);

export default router;
