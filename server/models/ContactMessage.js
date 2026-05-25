import mongoose from 'mongoose';

const contactMessageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide an email address'],
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address',
      ],
    },
    subject: {
      type: String,
      trim: true,
    },
    type: {
      type: String,
      enum: ['Query', 'Suggestion'],
      default: 'Query',
    },
    message: {
      type: String,
      required: [true, 'Please provide a message'],
    },
    status: {
      type: String,
      enum: ['Pending', 'Resolved', 'Accepted', 'Rejected'],
      default: 'Pending',
    },
  },
  {
    timestamps: true,
  }
);

const ContactMessage = mongoose.model('ContactMessage', contactMessageSchema);

export default ContactMessage;
