import express from 'express';
import Png from '../models/Png.js';

const router = express.Router();

/**
 * @desc Get search suggestions and matching items
 * @route GET /api/search
 * @access Public
 */
router.get('/', async (req, res, next) => {
  try {
    const query = req.query.q;
    if (!query || query.trim() === '') {
      return res.status(200).json({ success: true, suggestions: [], data: [] });
    }

    const regex = new RegExp(query.trim(), 'i');
    
    // Search titles or tags matching query
    const pngs = await Png.find({
      approved: true,
      $or: [{ title: regex }, { tags: regex }]
    })
    .limit(10)
    .select('title tags slug imageUrl');

    // Build autocomplete suggestions
    const suggestionsSet = new Set();
    const cleanQuery = query.trim().toLowerCase();

    pngs.forEach(png => {
      // Suggest matching title
      if (png.title.toLowerCase().includes(cleanQuery)) {
        suggestionsSet.add(png.title);
      }
      // Suggest matching tags
      png.tags.forEach(tag => {
        if (tag.toLowerCase().includes(cleanQuery)) {
          suggestionsSet.add(tag);
        }
      });
    });

    res.status(200).json({
      success: true,
      suggestions: Array.from(suggestionsSet).slice(0, 8),
      data: pngs
    });
  } catch (error) {
    next(error);
  }
});

export default router;
