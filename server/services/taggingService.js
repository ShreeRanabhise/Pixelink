import OpenAI from 'openai';
import Setting from '../models/Setting.js';

// Stopwords for local tag generation fallback
const STOPWORDS = new Set([
  'the', 'and', 'a', 'for', 'png', 'transparent', 'free', 'download', 'image', 'picture', 'photo',
  'with', 'on', 'at', 'by', 'an', 'to', 'of', 'in', 'is', 'it', 'this', 'that', 'or', 'as', 'but'
]);

export const generateTagsAndDescription = async (title, description = '', categoryName = '') => {
  const settings = await Setting.findOne() || {};
  const apiKey = process.env.OPENAI_API_KEY || settings.openAiApiKey;

  if (apiKey) {
    try {
      console.log('[AI Service] Querying OpenAI GPT for tags and description...');
      const openai = new OpenAI({ apiKey });

      const prompt = `You are an SEO expert.
Analyze the following PNG details:
Name: ${title}
Category: ${categoryName}

Perform two tasks:
1. Generate exactly 25 SEO-friendly single-word comma-separated tags for this PNG. 
   Rules for tags: single word only, lowercase only, comma separated, no numbering, no explanations.
2. Generate a professional SEO-friendly description of exactly 20 to 25 words.
   Rules for description: Mention best uses, human readable, SEO optimized, no keyword stuffing.

Return the result strictly as a JSON object:
{
  "tags": "tag1,tag2,tag3,...",
  "description": "Your 20-25 word description here."
}`;

      const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        response_format: { type: "json_object" },
      });

      const content = JSON.parse(response.choices[0].message.content);
      
      const tagsArray = content.tags
        .split(',')
        .map((tag) => tag.trim().toLowerCase())
        .filter((tag) => tag.length > 1);

      return {
        tags: [...new Set(tagsArray)],
        description: content.description || ''
      };
    } catch (error) {
      console.error('[AI Service] OpenAI tagging failed:', error.message);
      console.warn('[AI Service] Falling back to local keyword extraction.');
    }
  }

  // Fallback Keyword Extraction Heuristic
  const tagsSet = new Set();
  if (categoryName) {
    tagsSet.add(categoryName.toLowerCase().trim());
  }
  const sourceText = `${title} ${description}`.toLowerCase();
  const words = sourceText.match(/\b[a-z0-9]{3,15}\b/g) || [];

  for (const word of words) {
    if (!STOPWORDS.has(word)) {
      tagsSet.add(word);
    }
  }

  if (tagsSet.size === 0) {
    tagsSet.add('png');
    tagsSet.add('clipart');
    tagsSet.add('graphics');
  }

  return {
    tags: Array.from(tagsSet).slice(0, 12),
    description: description || title
  };
};

/**
 * Legacy wrapper for compatibility
 */
export const generateTags = async (title, description = '', categoryName = '') => {
  const result = await generateTagsAndDescription(title, description, categoryName);
  return result.tags;
};
