import { enhanceImage } from './imageEnhancementService.js';
import { generateTags } from './taggingService.js';

/**
 * Orchestrates the full AI workflow: removes background, upscales, and generates tags/categories.
 * @param {Object} file - Multer file object
 * @param {Object} metadata - Metadata containing title, description, and category name
 * @returns {Promise<{ buffer: Buffer, tags: string[] }>}
 */
export const processUploadAI = async (file, metadata) => {
  const { title, description, categoryName } = metadata;
  let processedBuffer = file.buffer;

  try {
    // 2. Enhance image
    processedBuffer = await enhanceImage(processedBuffer);

    // 3. Generate tags
    const tags = await generateTags(title, description, categoryName);

    return {
      buffer: processedBuffer,
      tags,
    };
  } catch (error) {
    console.error('[AI Orchestration Error]', error);
    // If any steps fail, return the original buffer and basic tag extraction
    const tags = await generateTags(title, description, categoryName);
    return {
      buffer: file.buffer,
      tags,
    };
  }
};
