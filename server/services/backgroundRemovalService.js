import { removeBackground as imglyRemoveBackground } from '@imgly/background-removal-node';
import axios from 'axios';
import FormData from 'form-data';

/**
 * Removes background using Remove.bg API if configured, otherwise falls back to a local ONNX ML model.
 * @param {Buffer} buffer - Original image buffer
 * @returns {Promise<Buffer>} - PNG buffer with background removed
 */
export const removeBackground = async (buffer) => {
  const apiKey = process.env.REMOVE_BG_API_KEY;

  if (apiKey) {
    try {
      console.log('[AI Service] Attempting to remove background via Remove.bg API...');
      const formData = new FormData();
      formData.append('image_file', buffer, { filename: 'input.png' });
      formData.append('size', 'auto');

      const response = await axios({
        method: 'post',
        url: 'https://api.remove.bg/v1.0/removebg',
        data: formData,
        headers: {
          ...formData.getHeaders(),
          'X-Api-Key': apiKey,
        },
        responseType: 'arraybuffer',
      });

      console.log('[AI Service] Remove.bg background removal successful.');
      return Buffer.from(response.data);
    } catch (error) {
      console.error('[AI Service] Remove.bg API failed:', error.response?.data?.toString() || error.message);
      console.log('[AI Service] Falling back to local ML model due to API failure...');
    }
  } else {
    console.log('[AI Service] No REMOVE_BG_API_KEY found. Using free local ML model.');
  }

  // Fallback / Local ML approach
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
