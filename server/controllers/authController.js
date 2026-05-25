import User from '../models/User.js';
import jwt from 'jsonwebtoken';

/**
 * @desc Login user & get token
 * @route POST /api/auth/login
 * @access Public
 */
export const login = async (req, res, next) => {
  const { email, password, role } = req.body;

  try {
    // Validation
    if (!email || !password || !role) {
      return res.status(400).json({ success: false, message: 'Please provide email, password, and select a role' });
    }

    // Check user
    const user = await User.findOne({ email }).select('+password'); // Explicitly select password if schema select is false (but we didn't specify select: false, so it's fine)
    
    if (!user || user.role !== role) {
      return res.status(401).json({ success: false, message: 'Invalid credentials or role' });
    }

    // Match password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Generate Token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || 'supersecretjwttokenkey123!@#',
      { expiresIn: '7d' }
    );

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (req.body.name) user.name = req.body.name;
    if (req.body.email) user.email = req.body.email;
    if (req.body.password) {
      user.password = req.body.password;
    }

    await user.save();

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};
