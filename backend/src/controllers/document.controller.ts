import { Response } from 'express';
import fs from 'fs/promises';
import path from 'path';
import { DocumentModel } from '../models/Document';
import { AuthRequest } from '../middleware/auth.middleware';
import { extractTextFromFile } from '../utils/extractText';
import { generateSummary, generateEmbedding } from '../utils/ai';
import mongoose from 'mongoose';
import { getCache, setCache, deleteCache } from '../utils/cache';

/**
 * POST /api/documents/upload
 * User uploads PDF/TXT. Text extract hota hai.
 * AI summary + embedding Part 4 mein add honge.
 */
export const uploadDocument = async (req: AuthRequest, res: Response) => {
  const file = req.file;

  try {
    if (!file) return res.status(400).json({ message: 'No file uploaded' });
    if (!req.user) return res.status(401).json({ message: 'Not authorized' });

    const ext = path.extname(file.originalname).toLowerCase();
    const fileType = ext === '.pdf' ? 'pdf' : ext === '.txt' ? 'txt' : null;

    if (!fileType) {
      await fs.unlink(file.path).catch(() => {});
      return res.status(400).json({ message: 'Only PDF and TXT allowed' });
    }

    const doc = await DocumentModel.create({
      userId: req.user.userId,
      originalName: file.originalname,
      fileName: file.filename,
      fileType,
      fileSize: file.size,
      filePath: file.path,
      status: 'processing',
    });

    try {
      // 1. Text extract
      const text = await extractTextFromFile(file.path, fileType);
      doc.extractedText = text;

      // 2. AI Summary
      const summary = await generateSummary(text);
      doc.summary = summary;

      // 3. Embedding
      const embedding = await generateEmbedding(text);
      doc.embedding = embedding;

      doc.status = 'completed';
      await doc.save();

      await deleteCache('docs:*');
      await deleteCache('search:*');

      return res.status(201).json({
        message: 'Document uploaded and processed',
        document: {
          id: doc._id,
          originalName: doc.originalName,
          fileType: doc.fileType,
          fileSize: doc.fileSize,
          status: doc.status,
          summary: doc.summary,
          createdAt: doc.createdAt,
        },
      });
    } catch (err: any) {
      doc.status = 'failed';
      doc.errorMessage = err.message;
      await doc.save();
      return res.status(500).json({
        message: 'Processing failed',
        error: err.message,
      });
    }
  } catch (error: any) {
    if (file?.path) await fs.unlink(file.path).catch(() => {});
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * GET /api/documents
 * User apne documents dekhega. Admin sab dekhega.
 */
export const listDocuments = async (req: AuthRequest, res: Response) => {
  try {
    const cacheKey = `docs:${req.user?.role}:${req.user?.userId}`;
    const cached = await getCache<{ count: number; documents: any[] }>(cacheKey);
    if (cached) return res.json(cached);

    const isAdmin = req.user?.role === 'admin';
    const filter = isAdmin ? {} : { userId: req.user?.userId };

    const docs = await DocumentModel.find(filter)
      .select('-extractedText -embedding')
      .sort({ createdAt: -1 });

    const payload = { count: docs.length, documents: docs };
    await setCache(cacheKey, payload, 60); // 1 min cache
    return res.json(payload);
  } catch (error: any) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * GET /api/documents/:id
 * Single document with summary + extracted text.
 */
export const getDocument = async (req: AuthRequest, res: Response) => {
  try {
    const doc = await DocumentModel.findById(req.params.id);

    if (!doc) return res.status(404).json({ message: 'Document not found' });

    const isOwner = doc.userId.toString() === req.user?.userId;
    const isAdmin = req.user?.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: 'Access denied' });
    }

    return res.json({ document: doc });
  } catch (error: any) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * DELETE /api/documents/:id
 * Owner ya Admin delete kar sakta hai.
 */
export const deleteDocument = async (req: AuthRequest, res: Response) => {
  try {
    const doc = await DocumentModel.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: 'Document not found' });

    const isOwner = doc.userId.toString() === req.user?.userId;
    const isAdmin = req.user?.role === 'admin';
    if (!isOwner && !isAdmin) return res.status(403).json({ message: 'Access denied' });

    await fs.unlink(doc.filePath).catch(() => {});
    await doc.deleteOne();

    // cache clear
    await deleteCache(`docs:*`);
    await deleteCache(`search:*`);

    return res.json({ message: 'Document deleted successfully' });
  } catch (error: any) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * GET /api/documents/search?q=
 * Part 4 mein vector search aayega. Abhi simple text search.
 */
export const searchDocuments = async (req: AuthRequest, res: Response) => {
  try {
    const q = (req.query.q as string) || '';
    if (!q.trim()) {
      return res.status(400).json({ message: 'Query parameter q is required' });
    }

    const cacheKey = `search:${req.user?.role}:${req.user?.userId}:${q}`;
    const cached = await getCache<any>(cacheKey);
    if (cached) return res.json(cached);

    const isAdmin = req.user?.role === 'admin';
    const userFilter = isAdmin ? {} : { userId: new mongoose.Types.ObjectId(req.user?.userId) };

    // Query ka embedding banao
    const queryEmbedding = await generateEmbedding(q);

    if (!queryEmbedding.length) {
      return res.status(400).json({ message: 'Could not generate embedding for query' });
    }

    // Atlas Vector Search
    const results = await DocumentModel.aggregate([
      {
        $vectorSearch: {
          index: 'vector_index',       // 👈 Atlas mein jo naam doge wahi
          path: 'embedding',
          queryVector: queryEmbedding,
          numCandidates: 100,
          limit: 10,
          filter: userFilter,          // RBAC: user sirf apne docs
        },
      },
      {
        $project: {
          embedding: 0,
          extractedText: 0,
        },
      },
      {
        $addFields: {
          score: { $meta: 'vectorSearchScore' },
        },
      },
    ]);

    const payload = { query: q, count: results.length, results };
    await setCache(cacheKey, payload, 120); // 2 min
    return res.json(payload);
  } catch (error: any) {
    console.error('Search error:', error);
    return res.status(500).json({ message: 'Search failed', error: error.message });
  }
};