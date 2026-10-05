export type UserRole = 'user' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export type ProcessingStatus = 'pending' | 'processing' | 'completed' | 'failed';
export type FileType = 'pdf' | 'txt';

export interface DocumentItem {
  _id: string;
  userId: string | { _id: string; name: string; email: string };
  originalName: string;
  fileName: string;
  fileType: FileType;
  fileSize: number;
  summary: string;
  extractedText?: string;
  status: ProcessingStatus;
  createdAt: string;
  updatedAt: string;
  errorMessage?: string;
}

export interface AdminStats {
  totalUsers: number;
  totalDocuments: number;
  completed: number;
  failed: number;
  pending: number;
}