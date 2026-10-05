import { Response } from 'express';
import { DocumentModel } from '../models/Document';
import { User } from '../models/User';
import { AuthRequest } from '../middleware/auth.middleware';
import { generateSummary, generateEmbedding } from '../utils/ai';
import { deleteCache } from '../utils/cache';

/**
 * GET /api/admin/documents
 * Admin sab documents dekhega.
 */
export const adminListAllDocuments = async (req: AuthRequest, res: Response) => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string) || 10));
    const skip = (page - 1) * limit;

    const total = await DocumentModel.countDocuments();

    const docs = await DocumentModel.find()
      .select('-extractedText -embedding')
      .populate('userId', 'name email role')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return res.json({
      count: docs.length,
      total,
      page,
      pages: Math.ceil(total / limit) || 1,
      limit,
      documents: docs,
    });
  } catch (error: any) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * GET /api/admin/stats
 * System statistics.
 */
export const adminStats = async (_req: AuthRequest, res: Response) => {
  try {
    const [totalUsers, totalDocs, completed, failed, pending] = await Promise.all([
      User.countDocuments(),
      DocumentModel.countDocuments(),
      DocumentModel.countDocuments({ status: 'completed' }),
      DocumentModel.countDocuments({ status: 'failed' }),
      DocumentModel.countDocuments({ status: { $in: ['pending', 'processing'] } }),
    ]);

    return res.json({
      totalUsers,
      totalDocuments: totalDocs,
      completed,
      failed,
      pending,
    });
  } catch (error: any) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * POST /api/admin/refresh-summary/:id
 * Part 4 mein actual AI summary regenerate hoga.
 * Abhi placeholder — status reset kar dete hain.
 */
export const refreshSummary = async (req: AuthRequest, res: Response) => {
  try {
    const doc = await DocumentModel.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: 'Document not found' });

    if (!doc.extractedText) {
      return res.status(400).json({ message: 'No text available to summarize' });
    }

    const summary = await generateSummary(doc.extractedText);
    doc.summary = summary;

    const embedding = await generateEmbedding(doc.extractedText);
    doc.embedding = embedding;

    await doc.save();
    await deleteCache('docs:*');
    await deleteCache('search:*');

    return res.json({ message: 'Summary regenerated', summary });
  } catch (error: any) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};