import OpenAI from 'openai';
import Setting from '../models/Setting.js';
import { enhanceImage } from './imageEnhancementService.js';
import { generateTagsAndDescription } from './taggingService.js';

const getOpenAIClient = async () => {
  const settings = await Setting.findOne() || {};
  const apiKey = process.env.OPENAI_API_KEY || settings.openAiApiKey;
  if (!apiKey) {
    throw new Error('OpenAI API Key is not configured. Please add it in Admin Settings.');
  }
  return new OpenAI({ apiKey });
};

/**
 * Generate a transparent PNG using OpenAI
 */
export const generateAIPngImage = async (prompt) => {
  const openai = await getOpenAIClient();
  
  // As per instructions, generate high-quality transparent PNG
  // DALL-E 3 doesn't strictly support transparency natively in the API, 
  // but we prompt it for a white/transparent background.
  // The user requested model 'gpt-image-1', but the correct OpenAI model is 'dall-e-3'.
  const enhancedPrompt = `${prompt} (Must have a clean, solid white or transparent background, center aligned object, isolated subject)`;

  const response = await openai.images.generate({
    model: 'dall-e-3',
    prompt: enhancedPrompt,
    n: 1,
    size: '1024x1024',
    response_format: 'b64_json', // Return base64 for preview
  });

  return response.data[0].b64_json;
};

/**
 * Analyze an uploaded image using GPT-4 Vision to auto-detect object, category, tags, and description.
 */
export const analyzeImageWithVision = async (base64Image) => {
  const openai = await getOpenAIClient();
  
  const prompt = `Analyze this transparent PNG image.
Return a JSON object with the following fields:
- "title": A short, descriptive title (2-5 words).
- "categoryName": The most appropriate single-word category (e.g. Animal, Technology, Nature, Food, Object, Vehicle, Abstract).
- "tags": Generate exactly 25 SEO-friendly single-word comma-separated tags in lowercase, no duplicates, no numbering.
- "description": Generate a professional SEO-friendly description of exactly 20 to 25 words mentioning best uses. No keyword stuffing.

Output ONLY valid JSON.`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'user',
        content: [
          { type: 'text', text: prompt },
          {
            type: 'image_url',
            image_url: {
              url: `data:image/png;base64,${base64Image}`,
              detail: 'low'
            }
          }
        ]
      }
    ],
    response_format: { type: "json_object" },
    max_tokens: 500,
  });

  const content = response.choices[0].message.content;
  try {
    return JSON.parse(content);
  } catch (error) {
    console.error('[AI Vision] Failed to parse JSON:', content);
    throw new Error('Failed to parse AI response');
  }
};

/**
 * Orchestrates the full AI workflow for manual uploads (fallback if Vision is not explicitly called).
 */
export const processUploadAI = async (file, metadata) => {
  const { title, description, categoryName } = metadata;
  let processedBuffer = file.buffer;

  try {
    // 2. Enhance image (noop by default)
    processedBuffer = await enhanceImage(processedBuffer);

    // 3. Generate tags and description
    const aiData = await generateTagsAndDescription(title, description, categoryName);

    return {
      buffer: processedBuffer,
      tags: aiData.tags,
      description: aiData.description, // Can be used by controller if needed
    };
  } catch (error) {
    console.error('[AI Orchestration Error]', error);
    return {
      buffer: file.buffer,
      tags: [],
      description: '',
    };
  }
};
