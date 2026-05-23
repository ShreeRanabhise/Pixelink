import multer from 'multer';

// Use memory storage to get buffer access for direct pipe uploads
const storage = multer.memoryStorage();

// File filter to restrict uploads
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/svg+xml', 'image/gif'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Allowed formats: PNG, JPEG, WEBP, SVG, GIF'), false);
  }
};

// Limit uploads to 10MB
const limits = {
  fileSize: 10 * 1024 * 1024, // 10MB
};

const upload = multer({
  storage,
  fileFilter,
  limits,
});

export default upload;
