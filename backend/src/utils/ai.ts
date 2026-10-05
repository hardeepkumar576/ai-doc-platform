import { openai } from '../config/openai';

/**
 * Document ka summary generate karta hai.
 * GPT-4o-mini use ho raha hai (sasta + fast).
 */
export const generateSummary = async (text: string): Promise<string> => {
  if (!text || text.trim().length < 20) {
    return 'Document is too short to summarize.';
  }

  // Token limit ke liye text truncate (approx 12000 chars)
  const trimmed = text.slice(0, 12000);

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content:
          'You are a helpful assistant that summarizes documents. Provide a concise summary in 3-5 sentences. Focus on key points.',
      },
      {
        role: 'user',
        content: `Summarize the following document:\n\n${trimmed}`,
      },
    ],
    temperature: 0.3,
    max_tokens: 300,
  });

  return response.choices[0]?.message?.content?.trim() || 'Summary not available';
};

/**
 * Text ka vector embedding banata hai.
 * text-embedding-3-small = 1536 dimensions.
 */
export const generateEmbedding = async (text: string): Promise<number[]> => {
  const trimmed = (text || '').slice(0, 8000).trim();
  if (!trimmed) return [];

  const response = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: trimmed,
  });

  return response.data[0].embedding;
};