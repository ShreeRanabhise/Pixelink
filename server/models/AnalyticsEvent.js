import mongoose from 'mongoose';

const analyticsEventSchema = new mongoose.Schema({
  eventType: {
    type: String,
    required: true,
    enum: ['view', 'download', 'search']
  },
  pngId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Png',
    default: null
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    default: null
  },
  ipAddress: {
    type: String,
    default: 'unknown'
  },
  country: {
    type: String,
    default: 'unknown'
  },
  referer: {
    type: String,
    default: 'direct'
  },
  searchQuery: {
    type: String,
    default: ''
  },
  userAgent: {
    type: String,
    default: ''
  }
}, { timestamps: true });

// Index for fast time-series and event aggregation
analyticsEventSchema.index({ eventType: 1, createdAt: -1 });
analyticsEventSchema.index({ pngId: 1, eventType: 1 });
analyticsEventSchema.index({ country: 1 });

export default mongoose.model('AnalyticsEvent', analyticsEventSchema);
