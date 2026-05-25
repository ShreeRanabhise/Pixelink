import Setting from '../models/Setting.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getSettings = async (req, res, next) => {
  try {
    let settings = await Setting.findOne();
    if (!settings) {
      settings = await Setting.create({});
    }
    res.status(200).json({ success: true, data: settings });
  } catch (error) {
    next(error);
  }
};

export const updateSettings = async (req, res, next) => {
  try {
    const { siteName, heroTitle, heroSubtitle, contactEmail, contactPhone, contactAddress } = req.body;
    let settings = await Setting.findOne();
    if (!settings) settings = new Setting();
    
    if (siteName !== undefined) settings.siteName = siteName;
    if (heroTitle !== undefined) settings.heroTitle = heroTitle;
    if (heroSubtitle !== undefined) settings.heroSubtitle = heroSubtitle;
    if (contactEmail !== undefined) settings.contactEmail = contactEmail;
    if (contactPhone !== undefined) settings.contactPhone = contactPhone;
    if (contactAddress !== undefined) settings.contactAddress = contactAddress;

    await settings.save();
    
    res.status(200).json({ success: true, data: settings, message: 'Settings updated successfully' });
  } catch (error) {
    next(error);
  }
};

export const updateLogo = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload an image file' });
    }
    
    const uploadsDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadsDir)){
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const filename = `logo-${Date.now()}${path.extname(req.file.originalname)}`;
    const uploadPath = path.join(uploadsDir, filename);
    fs.writeFileSync(uploadPath, req.file.buffer);
    
    // Fallback: the server mounts /uploads as a static directory
    // To ensure the client can fetch it via the backend API domain:
    // Actually, backend URL is usually handled by axios interceptor, but the path is just /uploads/filename
    const logoUrl = `http://localhost:5000/uploads/${filename}`; // Just for dev convenience. We could just use /uploads/filename and let frontend resolve it, but API URL is better. Wait, frontend uses Vite proxy, so /uploads/filename might not route correctly unless Vite proxy is configured. The React app is running on 5173. The backend is 5000. It's safer to store just the path and let the frontend prepend the API URL. But wait, we can just use the absolute backend URL if we want, or relative. Let's use relative and frontend handles it. 
    // Actually, earlier Cloudinary uses full URLs. Let's just use /uploads/filename and the frontend can prepend api.defaults.baseURL.
    
    let settings = await Setting.findOne();
    if (!settings) settings = new Setting();
    
    settings.logoUrl = `/uploads/${filename}`;
    await settings.save();
    
    res.status(200).json({ success: true, data: settings, message: 'Logo updated successfully' });
  } catch (error) {
    next(error);
  }
};

export const getSystemHealth = async (req, res, next) => {
  try {
    const isCloudinaryConfigured = !!(
      process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
    );

    res.status(200).json({
      success: true,
      health: {
        cloudinary: isCloudinaryConfigured,
      }
    });
  } catch (error) {
    next(error);
  }
};
