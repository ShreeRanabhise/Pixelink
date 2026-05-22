import Category from '../models/Category.js';
import { uploadBuffer, deleteAsset } from '../config/cloudinary.js';

// Helper to create slug
const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

/**
 * @desc Get all categories
 * @route GET /api/categories
 * @access Public
 */
export const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find();
    res.status(200).json({ success: true, count: categories.length, data: categories });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Create new category
 * @route POST /api/categories
 * @access Private/Admin
 */
export const createCategory = async (req, res, next) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: 'Please provide a category name' });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a category cover image' });
    }

    // Upload to Cloudinary / Local
    const uploadResult = await uploadBuffer(req.file.buffer, 'categories', req.file.originalname);

    const slug = slugify(name);

    // Check duplicate slug
    const duplicate = await Category.findOne({ slug });
    if (duplicate) {
      return res.status(400).json({ success: false, message: `Category with name/slug "${name}" already exists` });
    }

    const category = await Category.create({
      name,
      slug,
      description,
      image: uploadResult.secure_url,
    });

    res.status(201).json({ success: true, data: category });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Update category
 * @route PUT /api/categories/:id
 * @access Private/Admin
 */
export const updateCategory = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    let category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    const updateFields = { description };

    if (name) {
      updateFields.name = name;
      updateFields.slug = slugify(name);

      // Check duplicate slug excluding current category
      const duplicate = await Category.findOne({ slug: updateFields.slug, _id: { $ne: req.params.id } });
      if (duplicate) {
        return res.status(400).json({ success: false, message: `Category with name "${name}" already exists` });
      }
    }

    if (req.file) {
      // Delete old file if it was local or Cloudinary
      // In a production app, you might parse category.image to extract publicId, but we can bypass or delete
      // To prevent errors, we'll try parsing a Cloudinary publicId if applicable
      try {
        if (category.image && category.image.includes('res.cloudinary.com')) {
          const publicId = category.image.split('/').slice(-2).join('/').split('.')[0];
          await deleteAsset(publicId);
        } else if (category.image && category.image.includes('/uploads/')) {
          // It's local
          const parts = category.image.split('/uploads/')[1];
          await deleteAsset(`local/${parts}`);
        }
      } catch (err) {
        console.error('Failed to delete old category image asset:', err.message);
      }

      const uploadResult = await uploadBuffer(req.file.buffer, 'categories', req.file.originalname);
      updateFields.image = uploadResult.secure_url;
    }

    category = await Category.findByIdAndUpdate(req.params.id, updateFields, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, data: category });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Delete category
 * @route DELETE /api/categories/:id
 * @access Private/Admin
 */
export const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    // Delete image asset
    try {
      if (category.image && category.image.includes('res.cloudinary.com')) {
        const publicId = category.image.split('/').slice(-2).join('/').split('.')[0];
        await deleteAsset(publicId);
      } else if (category.image && category.image.includes('/uploads/')) {
        const parts = category.image.split('/uploads/')[1];
        await deleteAsset(`local/${parts}`);
      }
    } catch (err) {
      console.error('Failed to delete category image asset:', err.message);
    }

    await Category.findByIdAndDelete(req.params.id);

    res.status(200).json({ success: true, message: 'Category deleted successfully' });
  } catch (error) {
    next(error);
  }
};
