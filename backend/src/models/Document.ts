import mongoose, { Document as MongooseDocument, Schema, Types } from 'mongoose';

export type ProcessingStatus = 'pending' | 'processing' | 'completed' | 'failed';
export type FileType = 'pdf' | 'txt';

export interface IDocument extends MongooseDocument {
  userId: Types.ObjectId;
  originalName: string;
  fileName: string;
  fileType: FileType;
  fileSize: number;
  filePath: string;
  extractedText: string;
  summary: string;
  embedding: number[];       // Part 4 mein fill hoga
  status: ProcessingStatus;
  errorMessage?: string;
  createdAt: Date;
  updatedAt: Date;
}

const documentSchema = new Schema<IDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    originalName: { type: String, required: true },
    fileName: { type: String, required: true },
    fileType: { type: String, enum: ['pdf', 'txt'], required: true },
    fileSize: { type: Number, required: true },
    filePath: { type: String, required: true },
    extractedText: { type: String, default: '' },
    summary: { type: String, default: '' },
    embedding: { type: [Number], default: [] },
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed'],
      default: 'pending',
    },
    errorMessage: { type: String },
  },
  { timestamps: true }
);

export const DocumentModel = mongoose.model<IDocument>('Document', documentSchema);