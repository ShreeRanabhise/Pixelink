import mongoose from 'mongoose';

const pngPerformanceSchema = new mongoose.Schema({
  pngId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Png',
    required: true,
    unique: true
  },
  ctr: {
    type: Number,
    default: 0 // downloads / views
  },
  lastCalculated: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

export default mongoose.model('PngPerformance', pngPerformanceSchema);
