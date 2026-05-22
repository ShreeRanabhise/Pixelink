import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

// Flag to check if Cloudinary is configured
const isCloudinaryConfigured = !!(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
);

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  console.log('Cloudinary initialized successfully.');
} else {
  console.warn('Cloudinary environment variables missing. Falling back to local storage in server/uploads/ directory.');
}

/**
 * Uploads a buffer to Cloudinary, or falls back to local file storage.
 * @param {Buffer} buffer - File buffer
 * @param {string} folder - Destination folder name (e.g. 'pngs', 'submissions')
 * @param {string} originalName - Original filename for local fallback naming
 * @returns {Promise<{ secure_url: string, public_id: string }>}
 */
export const uploadBuffer = async (buffer, folder, originalName = 'image.png') => {
  if (isCloudinaryConfigured) {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: `pngworld/${folder}`,
          resource_type: 'image',
        },
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload error:', error);
            reject(error);
          } else {
            resolve({
              secure_url: result.secure_url,
              public_id: result.public_id,
            });
          }
        }
      );
      uploadStream.end(buffer);
    });
  } else {
    // Local Fallback Storage
    try {
      const __dirname = path.resolve();
      const uploadDir = path.join(__dirname, 'uploads', folder);
      
      // Ensure folder exists
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const fileExtension = path.extname(originalName) || '.png';
      const uniqueFilename = `${crypto.randomBytes(16).toString('hex')}${fileExtension}`;
      const filePath = path.join(uploadDir, uniqueFilename);

      // Write buffer to local disk
      fs.writeFileSync(filePath, buffer);

      // Return a URL pointing to our local server's static route
      const port = process.env.PORT || 5000;
      const secure_url = `http://localhost:${port}/uploads/${folder}/${uniqueFilename}`;
      const public_id = `local/${folder}/${uniqueFilename}`;

      console.log(`Local fallback upload success: ${secure_url}`);
      return { secure_url, public_id };
    } catch (error) {
      console.error('Local upload fallback error:', error);
      throw error;
    }
  }
};

/**
 * Deletes an asset from Cloudinary or local storage.
 * @param {string} publicId - Public ID or local path identifier
 * @returns {Promise<any>}
 */
export const deleteAsset = async (publicId) => {
  if (!publicId) return;

  if (isCloudinaryConfigured && !publicId.startsWith('local/')) {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.destroy(publicId, (error, result) => {
        if (error) {
          console.error('Cloudinary delete error:', error);
          reject(error);
        } else {
          resolve(result);
        }
      });
    });
  } else {
    // Local Fallback Delete
    try {
      const parts = publicId.split('/');
      if (parts.length >= 3 && parts[0] === 'local') {
        const folder = parts[1];
        const filename = parts[2];
        const __dirname = path.resolve();
        const filePath = path.join(__dirname, 'uploads', folder, filename);

        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
          console.log(`Local fallback file deleted: ${filePath}`);
        }
      }
      return { result: 'ok' };
    } catch (error) {
      console.error('Local delete fallback error:', error);
      return { result: 'error', error };
    }
  }
};

export default cloudinary;
