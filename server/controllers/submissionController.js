import Submission from '../models/Submission.js';
import Png from '../models/Png.js';
import Category from '../models/Category.js';
import { uploadBuffer, deleteAsset } from '../config/cloudinary.js';

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
 * @desc Submit a PNG for review (Anonymous user upload)
 * @route POST /api/submissions
 * @access Public
 */
export const createSubmission = async (req, res, next) => {
  try {
    const { title, categoryId, tags } = req.body;

    if (!title || !categoryId) {
      return res.status(400).json({ success: false, message: 'Title and Category are required' });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a transparent PNG image' });
    }

    const categoryObj = await Category.findById(categoryId);
    if (!categoryObj) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    // Upload to Cloudinary/Local in submissions folder
    const uploadResult = await uploadBuffer(req.file.buffer, 'submissions', req.file.originalname);

    let parsedTags = [];
    if (tags) {
      parsedTags = tags.split(',').map((t) => t.trim().toLowerCase()).filter(Boolean);
    } else {
      // Basic text parsing
      parsedTags = title.toLowerCase().match(/\b[a-z0-9]{3,15}\b/g) || [];
      parsedTags = [...new Set(parsedTags)].slice(0, 5);
    }

    const submission = await Submission.create({
      title,
      imageUrl: uploadResult.secure_url,
      cloudinaryId: uploadResult.public_id,
      category: categoryId,
      tags: parsedTags,
      status: 'pending',
      submitterIP: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    });

    res.status(201).json({
      success: true,
      message: 'PNG submitted successfully! Admin will review your submission soon.',
      data: submission,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Get all submissions
 * @route GET /api/submissions
 * @access Private/Admin
 */
export const getSubmissions = async (req, res, next) => {
  try {
    const statusFilter = req.query.status || 'pending';
    const submissions = await Submission.find({ status: statusFilter })
      .populate('category', 'name slug')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: submissions.length, data: submissions });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Approve or Reject submission
 * @route PUT /api/submissions/:id
 * @access Private/Admin
 */
export const updateSubmissionStatus = async (req, res, next) => {
  try {
    const { status, title, tags, categoryId } = req.body;

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status. Choose approved or rejected' });
    }

    const submission = await Submission.findById(req.params.id);
    if (!submission) {
      return res.status(404).json({ success: false, message: 'Submission not found' });
    }

    if (submission.status !== 'pending') {
      return res.status(400).json({ success: false, message: `Submission is already ${submission.status}` });
    }

    if (status === 'rejected') {
      submission.status = 'rejected';
      submission.reviewedBy = req.user._id;
      await submission.save();

      // Delete image asset to save storage space
      if (submission.cloudinaryId) {
        await deleteAsset(submission.cloudinaryId);
      }

      return res.status(200).json({ success: true, message: 'Submission rejected successfully', data: submission });
    }

    // status === 'approved'
    // 1. Gather properties (with optional overrides from Admin review panel)
    const finalTitle = title || submission.title;
    const finalCategoryId = categoryId || submission.category;
    let finalTags = submission.tags;

    if (tags) {
      finalTags = Array.isArray(tags) ? tags : tags.split(',').map((t) => t.trim().toLowerCase()).filter(Boolean);
    }

    const categoryObj = await Category.findById(finalCategoryId);
    if (!categoryObj) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    // 2. Generate slug
    let slug = slugify(finalTitle);
    const duplicate = await Png.findOne({ slug });
    if (duplicate) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    // 3. Move image file from submissions folder to pngs folder (Cloudinary does this, or we just use the url directly)
    // Cloudinary supports renaming/moving, but using the same url is standard and works perfectly. 
    // In our system, the URL remains valid so we can use it directly in the Png record.
    const newPng = await Png.create({
      title: finalTitle,
      slug,
      description: `User submitted PNG in category ${categoryObj.name}.`,
      imageUrl: submission.imageUrl,
      thumbnailUrl: submission.imageUrl,
      cloudinaryId: submission.cloudinaryId,
      category: finalCategoryId,
      tags: finalTags,
      approved: true,
    });

    // 4. Mark submission as approved
    submission.status = 'approved';
    submission.reviewedBy = req.user._id;
    await submission.save();

    res.status(200).json({
      success: true,
      message: 'Submission approved and published successfully!',
      data: {
        submission,
        png: newPng,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Approve or Reject multiple submissions at once
 * @route POST /api/submissions/bulk
 * @access Private/Admin
 */
export const bulkUpdateSubmissions = async (req, res, next) => {
  try {
    const { ids, status } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ success: false, message: 'No submission IDs provided' });
    }

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status. Choose approved or rejected' });
    }

    const submissions = await Submission.find({ _id: { $in: ids }, status: 'pending' });

    if (submissions.length === 0) {
      return res.status(404).json({ success: false, message: 'No pending submissions found for the provided IDs' });
    }

    let processedCount = 0;

    for (const submission of submissions) {
      if (status === 'rejected') {
        submission.status = 'rejected';
        submission.reviewedBy = req.user._id;
        await submission.save();
        if (submission.cloudinaryId) {
          await deleteAsset(submission.cloudinaryId);
        }
        processedCount++;
      } else if (status === 'approved') {
        const categoryObj = await Category.findById(submission.category);
        if (!categoryObj) continue; // Skip if category is invalid

        let slug = slugify(submission.title);
        const duplicate = await Png.findOne({ slug });
        if (duplicate) {
          slug = `${slug}-${Date.now().toString().slice(-4)}`;
        }

        await Png.create({
          title: submission.title,
          slug,
          description: `User submitted PNG in category ${categoryObj.name}.`,
          imageUrl: submission.imageUrl,
          thumbnailUrl: submission.imageUrl,
          cloudinaryId: submission.cloudinaryId,
          category: submission.category,
          tags: submission.tags,
          approved: true,
        });

        submission.status = 'approved';
        submission.reviewedBy = req.user._id;
        await submission.save();
        processedCount++;
      }
    }

    res.status(200).json({ 
      success: true, 
      message: `Bulk ${status} operation completed successfully. Processed ${processedCount} items.` 
    });
  } catch (error) {
    next(error);
  }
};
