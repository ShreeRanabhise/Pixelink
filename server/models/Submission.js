import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema(
  {
    imageUrl: {
      type: String,
      required: [true, 'Please provide the image URL'],
    },
    cloudinaryId: {
      type: String,
    },
    title: {
      type: String,
      required: [true, 'Please provide a title'],
      trim: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Please select a category'],
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    submitterIP: {
      type: String,
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

const Submission = mongoose.model('Submission', submissionSchema);

export default Submission;
