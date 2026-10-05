import fs from 'fs/promises';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const pdfParse = require('pdf-parse');

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