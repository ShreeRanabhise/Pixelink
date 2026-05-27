import { removeBackground as imglyRemoveBackground } from '@imgly/background-removal-node';
import sharp from 'sharp';

/**
 * Removes background using Remove.bg API if configured, otherwise falls back to a local ONNX ML model.
 * Automatically bypasses the process if the image is already transparent.
 * @param {Buffer} buffer - Original image buffer
 * @returns {Promise<Buffer>} - PNG buffer with background removed
 */
export const removeBackground = async (buffer) => {
  try {
    // PRE-CHECK: Determine if image is already transparent to save API calls/CPU
    console.log('[AI Service] Analyzing image transparency...');
    const stats = await sharp(buffer).stats();
    if (!stats.isOpaque) {
      console.log('[AI Service] Image already contains transparency. Bypassing background removal.');
      return buffer; // Return original buffer immediately
    }
  } catch (error) {
    console.error('[AI Service] Failed to analyze image transparency. Proceeding with removal:', error.message);
  }

  // Local ML approach
  try {
    console.log('[AI Service] Processing via local ML model (@imgly/background-removal-node)...');
    
    // The ML model processes the buffer and returns a Blob
    const blob = await imglyRemoveBackground(buffer);
    
    // Convert the Blob back to an ArrayBuffer, then to a Node Buffer
    const arrayBuffer = await blob.arrayBuffer();
    const resultBuffer = Buffer.from(arrayBuffer);

    console.log('[AI Service] Local background removal completed successfully.');
    return resultBuffer;
  } catch (error) {
    console.error('[AI Service] Local ML background removal failed:', error.message || error);
    console.warn('[AI Service] Falling back to original image buffer.');
    return buffer; // Graceful fallback
  }
};
