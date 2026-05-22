import mongoose from 'mongoose';

const settingSchema = new mongoose.Schema(
  {
    siteName: { type: String, default: 'PixelInk' },
    heroTitle: { type: String, default: 'Download High-Quality Transparent PNG Images Free' },
    heroSubtitle: { type: String, default: 'Discover and share millions of free transparent PNGs across 0+ categories no sign up required.' },
    logoUrl: { type: String, default: '/logo.png' }
  },
  { timestamps: true }
);

export default mongoose.model('Setting', settingSchema);
