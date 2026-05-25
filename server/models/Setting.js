import mongoose from 'mongoose';

const settingSchema = new mongoose.Schema(
  {
    siteName: { type: String, default: 'PixelInk' },
    heroTitle: { type: String, default: 'Download High-Quality Transparent PNG Images Free' },
    heroSubtitle: { type: String, default: 'Discover and share millions of free transparent PNGs across 0+ categories no sign up required.' },
    logoUrl: { type: String, default: '/logo.png' },
    contactEmail: { type: String, default: 'support@pixelink.com' },
    contactPhone: { type: String, default: '+1 (555) 123-4567' },
    contactAddress: { type: String, default: '100 Alpha Strip, San Francisco, CA' },
    adsenseEnabled: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export default mongoose.model('Setting', settingSchema);
