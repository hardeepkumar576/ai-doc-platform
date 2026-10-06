import fs from 'fs/promises';

// pdf-parse CommonJS/ESM interop issue — dono handle karo
// eslint-disable-next-line @typescript-eslint/no-var-requires
const pdfParseModule = require('pdf-parse');
const pdfParse = pdfParseModule.default || pdfParseModule;

export const extractTextFromFile = async (
  filePath: string,
  fileType: 'pdf' | 'txt'
): Promise<string> => {
  if (fileType === 'txt') {
    const text = await fs.readFile(filePath, 'utf-8');
    return text.trim();
  }

  if (fileType === 'pdf') {
    const buffer = await fs.readFile(filePath);
    const data = await pdfParse(buffer);
    return (data.text || '').trim();
  }

  throw new Error('Unsupported file type');
};