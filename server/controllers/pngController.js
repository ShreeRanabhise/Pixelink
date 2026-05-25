import Png from '../models/Png.js';
import Category from '../models/Category.js';
import { uploadBuffer, deleteAsset } from '../config/cloudinary.js';
import { processUploadAI } from '../services/aiService.js';
import geoip from 'geoip-lite';
import AnalyticsEvent from '../models/AnalyticsEvent.js';
import PngPerformance from '../models/PngPerformance.js';

const logAnalyticsEvent = async (req, eventType, data = {}) => {
  try {
    const ip = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || req.ip || 'unknown';
    let country = 'unknown';
    if (ip && ip !== 'unknown') {
      const geo = geoip.lookup(ip);
      if (geo) country = geo.country;
    }
    let referer = req.headers.referer || 'direct';
    // Clean up local referers
    if (referer.includes('localhost') || referer.includes('127.0.0.1')) {
      referer = 'direct';
    } else {
      try {
        const url = new URL(referer);
        referer = url.hostname;
      } catch (e) {}
    }

    await AnalyticsEvent.create({
      eventType,
      ipAddress: ip,
      country,
      referer,
      userAgent: req.headers['user-agent'] || '',
      ...data
    });
  } catch (err) {
    console.error('Analytics log error:', err);
  }
};

// Helper to generate slugs
const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

/**
 * @desc Get all approved PNGs
 * @route GET /api/pngs
 * @access Public
 */
export const getPngs = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 12;
    const skip = (page - 1) * limit;

    const query = { approved: true };

    // Category filter (accepts category slug or ObjectId)
    if (req.query.category) {
      const categoryObj = await Category.findOne({
        $or: [{ _id: req.query.category.match(/^[0-9a-fA-F]{24}$/) ? req.query.category : null }, { slug: req.query.category }],
      });
      if (categoryObj) {
        query.category = categoryObj._id;
      } else {
        // Return empty list if category does not exist
        return res.status(200).json({ success: true, count: 0, totalPages: 0, currentPage: page, data: [] });
      }
    }

    // Featured filter
    if (req.query.featured === 'true') {
      query.featured = true;
    }

    // Tag filter
    if (req.query.tag) {
      query.tags = req.query.tag.toLowerCase();
    }

    // Search query
    if (req.query.search) {
      const searchWords = req.query.search.trim().split(/\s+/);
      const regexQueries = searchWords.map(word => new RegExp(word, 'i'));
      
      query.$or = [
        { title: { $in: regexQueries } },
        { tags: { $in: regexQueries } },
        { description: { $in: regexQueries } }
      ];
      
      // Log search analytics (only on first page to prevent duplicates)
      if (page === 1) {
        logAnalyticsEvent(req, 'search', { searchQuery: req.query.search });
      }
    }

    // Sorting
    let sortBy = { createdAt: -1 }; // default: latest
    if (req.query.sort === 'popular') {
      sortBy = { downloads: -1, views: -1 };
    } else if (req.query.sort === 'views') {
      sortBy = { views: -1 };
    } else if (req.query.sort === 'downloads') {
      sortBy = { downloads: -1 };
    }

    const total = await Png.countDocuments(query);
    const pngs = await Png.find(query)
      .populate('category', 'name slug')
      .sort(sortBy)
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      count: pngs.length,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      totalCount: total,
      data: pngs,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Get logged in user's uploaded PNGs
 * @route GET /api/pngs/my-uploads
 * @access Private (Admin, Creator)
 */
export const getMyUploads = async (req, res, next) => {
  try {
    const pngs = await Png.find({ uploadedBy: req.user._id })
      .populate('category', 'name slug')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: pngs.length,
      data: pngs
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Get single PNG by slug
 * @route GET /api/pngs/:slug
 * @access Public
 */
export const getPngBySlug = async (req, res, next) => {
  try {
    const png = await Png.findOne({ slug: req.params.slug, approved: true }).populate('category', 'name slug');

    if (!png) {
      return res.status(404).json({ success: false, message: 'PNG not found' });
    }

    // Increment views
    png.views += 1;
    await png.save();

    // Log Analytics View Event
    logAnalyticsEvent(req, 'view', { pngId: png._id, category: png.category?._id || png.category });

    res.status(200).json({ success: true, data: png });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Create new PNG (Admin direct upload)
 * @route POST /api/pngs
 * @access Private/Admin
 */
export const createPng = async (req, res, next) => {
  try {
    const { title, description, categoryId, featured, runAI } = req.body;

    if (!title || !categoryId) {
      return res.status(400).json({ success: false, message: 'Title and Category are required' });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a transparent PNG image' });
    }

    if (req.file.mimetype !== 'image/png') {
      return res.status(400).json({ success: false, message: 'Only PNG images are allowed for the main asset.' });
    }

    const categoryObj = await Category.findById(categoryId);
    if (!categoryObj) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    let finalBuffer = req.file.buffer;
    let finalTags = [];

    // Check if AI services requested
    if (runAI === 'true') {
      const aiResults = await processUploadAI(req.file, {
        title,
        description,
        categoryName: categoryObj.name,
      });
      finalBuffer = aiResults.buffer;
      finalTags = aiResults.tags;
    } else {
      // Basic Local Tag Extraction if no AI
      // Parse custom tags if supplied in req.body
      if (req.body.tags) {
        finalTags = req.body.tags.split(',').map(t => t.trim().toLowerCase()).filter(Boolean);
      } else {
        const sourceText = `${title} ${description || ''}`.toLowerCase();
        finalTags = sourceText.match(/\b[a-z0-9]{3,15}\b/g) || [];
        finalTags = [...new Set(finalTags)].slice(0, 10);
      }
    }

    // Upload processed/original buffer to Cloudinary/Local
    const uploadResult = await uploadBuffer(finalBuffer, 'pngs', req.file.originalname);

    let slug = slugify(title);
    
    // De-duplicate slug by appending timestamp if exists
    const duplicate = await Png.findOne({ slug });
    if (duplicate) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    const png = await Png.create({
      title,
      slug,
      description,
      imageUrl: uploadResult.secure_url,
      thumbnailUrl: uploadResult.secure_url, // Cloudinary handles resize or we map to same URL
      cloudinaryId: uploadResult.public_id,
      category: categoryId,
      tags: finalTags,
      featured: featured === 'true',
      approved: true,
      uploadedBy: req.user._id,
    });

    res.status(201).json({ success: true, data: png });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Update PNG metadata
 * @route PUT /api/pngs/:id
 * @access Private/Admin
 */
export const updatePng = async (req, res, next) => {
  try {
    const { title, description, categoryId, tags, featured } = req.body;
    let png = await Png.findById(req.params.id);

    if (!png) {
      return res.status(404).json({ success: false, message: 'PNG not found' });
    }

    const updateFields = {};
    if (description !== undefined) updateFields.description = description;
    if (featured !== undefined) updateFields.featured = featured === 'true' || featured === true;

    if (title) {
      updateFields.title = title;
      updateFields.slug = slugify(title);

      const duplicate = await Png.findOne({ slug: updateFields.slug, _id: { $ne: req.params.id } });
      if (duplicate) {
        updateFields.slug = `${updateFields.slug}-${Date.now().toString().slice(-4)}`;
      }
    }

    if (categoryId) {
      const categoryObj = await Category.findById(categoryId);
      if (!categoryObj) {
        return res.status(404).json({ success: false, message: 'Category not found' });
      }
      updateFields.category = categoryId;
    }

    if (tags !== undefined) {
      updateFields.tags = Array.isArray(tags) 
        ? tags.map(t => t.toLowerCase())
        : tags.split(',').map(t => t.trim().toLowerCase()).filter(Boolean);
    }

    png = await Png.findByIdAndUpdate(req.params.id, updateFields, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, data: png });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Delete PNG
 * @route DELETE /api/pngs/:id
 * @access Private/Admin
 */
export const deletePng = async (req, res, next) => {
  try {
    const png = await Png.findById(req.params.id);

    if (!png) {
      return res.status(404).json({ success: false, message: 'PNG not found' });
    }

    // Delete image from Cloudinary / Local storage
    if (png.cloudinaryId) {
      await deleteAsset(png.cloudinaryId);
    }

    await Png.findByIdAndDelete(req.params.id);

    res.status(200).json({ success: true, message: 'PNG deleted successfully' });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Get global system stats for Admin Dashboard
 * @route GET /api/pngs/stats/global
 * @access Private/Admin
 */
export const getGlobalStats = async (req, res, next) => {
  try {
    const stats = await Png.aggregate([
      {
        $group: {
          _id: null,
          totalViews: { $sum: '$views' },
          totalDownloads: { $sum: '$downloads' },
          totalLikes: { $sum: '$likes' },
        },
      },
    ]);

    const result = stats[0] || { totalViews: 0, totalDownloads: 0, totalLikes: 0 };
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Increment or decrement like count
 * @route POST /api/pngs/:id/like
 * @access Public
 */
export const incrementLikes = async (req, res, next) => {
  try {
    const { action } = req.body; // 'like' or 'unlike'
    const png = await Png.findById(req.params.id);

    if (!png) {
      return res.status(404).json({ success: false, message: 'PNG not found' });
    }

    if (action === 'unlike') {
      png.likes = Math.max(0, png.likes - 1);
    } else {
      png.likes += 1;
    }
    
    await png.save();

    res.status(200).json({ success: true, likes: png.likes });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Increment download counts
 * @route POST /api/pngs/:id/download
 * @access Public
 */
export const incrementDownloads = async (req, res, next) => {
  try {
    const png = await Png.findById(req.params.id);

    if (!png) {
      return res.status(404).json({ success: false, message: 'PNG not found' });
    }

    png.downloads += 1;
    await png.save();

    // Log Analytics Download Event
    logAnalyticsEvent(req, 'download', { pngId: png._id, category: png.category });

    res.status(200).json({ success: true, downloads: png.downloads });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Get Similar PNGs
 * @route GET /api/pngs/:id/similar
 * @access Public
 */
export const getSimilarPngs = async (req, res, next) => {
  try {
    const png = await Png.findById(req.params.id);
    
    if (!png) {
      return res.status(404).json({ success: false, message: 'PNG not found' });
    }

    const limit = parseInt(req.query.limit, 10) || 5;

    // Build the query to find similar PNGs:
    // 1. Same category OR shares any of the tags
    // 2. Not the exact same PNG
    // 3. Must be approved
    const similarPngs = await Png.find({
      _id: { $ne: png._id },
      approved: true,
      $or: [
        { category: png.category },
        { tags: { $in: png.tags } }
      ]
    })
    .limit(limit)
    .sort({ views: -1, downloads: -1 }) // sort by popularity among similar ones
    .populate('category', 'name slug');

    res.status(200).json({ success: true, data: similarPngs });
  } catch (error) {
    next(error);
  }
};
