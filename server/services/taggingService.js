import axios from 'axios';
import Setting from '../models/Setting.js';

// Stopwords for local tag generation fallback
const STOPWORDS = new Set([
  'the', 'and', 'a', 'for', 'png', 'transparent', 'free', 'download', 'image', 'picture', 'photo',
  'with', 'on', 'at', 'by', 'an', 'to', 'of', 'in', 'is', 'it', 'this', 'that', 'or', 'as', 'but'
]);

/**
 * Generates relevant tagging tokens based on metadata.
 * @param {string} title - Image title
 * @param {string} description - Image description
 * @param {string} categoryName - Category name
 * @returns {Promise<string[]>} - Array of unique tag strings
 */
export const generateTags = async (title, description = '', categoryName = '') => {
  const settings = await Setting.findOne() || {};
  const apiKey = process.env.OPENAI_API_KEY || settings.openAiApiKey;

  if (apiKey) {
    try {
      console.log('[AI Service] Querying OpenAI GPT for tag suggestions...');
      const prompt = `Generate a list of 8 to 12 relevant, descriptive search tags for an image.
Title: "${title}"
Description: "${description}"
Category: "${categoryName}"

Return ONLY a comma-separated list of tags in lowercase. Example output: dog, pet, animal, labrador, puppy`;

      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.7,
        },
        {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const content = response.data?.choices?.[0]?.message?.content || '';
      const tags = content
        .split(',')
        .map((tag) => tag.trim().toLowerCase())
        .filter((tag) => tag.length > 1);

      if (tags.length > 0) {
        console.log('[AI Service] OpenAI tags generated:', tags);
        return [...new Set(tags)];
      }
    } catch (error) {
      console.error('[AI Service] OpenAI tagging failed:', error.response?.data || error.message);
      console.warn('[AI Service] Falling back to local keyword extraction.');
    }
  }

  // Fallback Keyword Extraction Heuristic
  const tagsSet = new Set();

  // Add category name if provided
  if (categoryName) {
    tagsSet.add(categoryName.toLowerCase().trim());
  }

  // Parse words from title & description
  const sourceText = `${title} ${description}`.toLowerCase();
  // Match only words/alphanumeric characters
  const words = sourceText.match(/\b[a-z0-9]{3,15}\b/g) || [];

  for (const word of words) {
    if (!STOPWORDS.has(word)) {
      tagsSet.add(word);
    }
  }

  // Ensure we return a default set of tag vectors if empty
  if (tagsSet.size === 0) {
    tagsSet.add('png');
    tagsSet.add('clipart');
    tagsSet.add('graphics');
  }

  const result = Array.from(tagsSet).slice(0, 12);
  console.log('[AI Service] Local fallback tags generated:', result);
  return result;
};
