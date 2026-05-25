import ContactMessage from '../models/ContactMessage.js';

// @desc    Submit a new contact message
// @route   POST /api/v1/contact-messages
// @access  Public
export const createMessage = async (req, res, next) => {
  try {
    const { name, email, subject, type, message } = req.body;
    
    const newMessage = await ContactMessage.create({
      name,
      email,
      subject,
      type,
      message
    });

    res.status(201).json({
      success: true,
      data: newMessage,
      message: 'Message sent successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all contact messages
// @route   GET /api/v1/contact-messages
// @access  Private/Admin
export const getMessages = async (req, res, next) => {
  try {
    // Optionally allow filtering by type or status
    const filter = {};
    if (req.query.type) filter.type = req.query.type;
    if (req.query.status) filter.status = req.query.status;

    const messages = await ContactMessage.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: messages.length,
      data: messages
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update contact message status
// @route   PUT /api/v1/contact-messages/:id
// @access  Private/Admin
export const updateMessageStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    const message = await ContactMessage.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!message) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }

    res.status(200).json({
      success: true,
      data: message
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a contact message
// @route   DELETE /api/v1/contact-messages/:id
// @access  Private/Admin
export const deleteMessage = async (req, res, next) => {
  try {
    const message = await ContactMessage.findByIdAndDelete(req.params.id);

    if (!message) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};
