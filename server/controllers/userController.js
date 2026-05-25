import User from '../models/User.js';
import mongoose from 'mongoose';

/**
 * @desc Get all users with progress stats
 * @route GET /api/users
 * @access Private/Admin
 */
export const getUsers = async (req, res, next) => {
  try {
    const users = await User.aggregate([
      {
        $lookup: {
          from: 'pngs',
          localField: '_id',
          foreignField: 'uploadedBy',
          as: 'uploads',
        },
      },
      {
        $lookup: {
          from: 'submissions',
          localField: '_id',
          foreignField: 'reviewedBy',
          as: 'reviews',
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          email: 1,
          role: 1,
          createdAt: 1,
          uploadsCount: { $size: '$uploads' },
          reviewsCount: { $size: '$reviews' },
        },
      },
      { $sort: { createdAt: -1 } },
    ]);

    res.status(200).json({ success: true, count: users.length, data: users });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Create a new user (Staff/Team)
 * @route POST /api/users
 * @access Private/Admin
 */
export const createUser = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ success: false, message: 'Please provide email, password, and role' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User with this email already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
      role,
    });

    res.status(201).json({
      success: true,
      message: 'Team member created successfully',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        uploadsCount: 0,
        reviewsCount: 0,
        createdAt: user.createdAt
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Update user details
 * @route PUT /api/users/:id
 * @access Private/Admin
 */
export const updateUser = async (req, res, next) => {
  try {
    const { name, email, role, password } = req.body;
    let user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return res.status(400).json({ success: false, message: 'Email is already in use by another account' });
      }
      user.email = email;
    }

    if (name) user.name = name;
    if (role) user.role = role;
    if (password) user.password = password; // Pre-save hook will hash this

    await user.save();

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Delete user
 * @route DELETE /api/users/:id
 * @access Private/Admin
 */
export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    // Prevent deleting yourself
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'You cannot delete your own account' });
    }

    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    next(error);
  }
};
