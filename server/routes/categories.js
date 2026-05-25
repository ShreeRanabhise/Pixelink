import express from 'express';
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/categoryController.js';
import { protect, authorizeRoles } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

router.get('/', getCategories);
router.post('/', protect, authorizeRoles('admin', 'creator'), upload.single('image'), createCategory);
router.put('/:id', protect, authorizeRoles('admin', 'creator'), upload.single('image'), updateCategory);
router.delete('/:id', protect, authorizeRoles('admin', 'creator'), deleteCategory);

export default router;
