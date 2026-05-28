import express from 'express';
import { generateAIPngImage, analyzeImageWithVision } from '../services/aiService.js';
import { generateTagsAndDescription } from '../services/taggingService.js';
import Category from '../models/Category.js';
import { protect, authorizeRoles } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

/**
 * @desc Generate transparent PNG via AI
 * @route POST /api/ai/generate-png
 * @access Private/Admin
 */
router.post('/generate-png', protect, authorizeRoles('admin'), async (req, res, next) => {
  try {
    const { title, categoryId } = req.body;
    if (!title || !categoryId) {
      return res.status(400).json({ success: false, message: 'Title and category are required' });
    }
    
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    const prompt = `Create a high-quality transparent PNG of ${title}. Category: ${category.name}. Ultra detailed, centered object, isolated subject.`;

    const [base64Image, metadata] = await Promise.all([
      generateAIPngImage(prompt),
      generateTagsAndDescription(title, '', category.name)
    ]);

    res.status(200).json({ 
      success: true, 
      data: {
        image: `data:image/png;base64,${base64Image}`,
        tags: metadata.tags,
        description: metadata.description
      } 
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @desc Analyze image using Vision AI to auto-fill metadata
 * @route POST /api/ai/analyze-image
 * @access Private/Admin
 */
router.post('/analyze-image', protect, authorizeRoles('admin', 'creator'), upload.single('image'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload an image to analyze' });
    }

    const base64Image = req.file.buffer.toString('base64');
    const metadata = await analyzeImageWithVision(base64Image);
    
    res.status(200).json({ success: true, data: metadata });
  } catch (error) {
    next(error);
  }
});

export default router;
