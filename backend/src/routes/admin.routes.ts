import { Router } from 'express';
import { protect, adminOnly } from '../middleware/auth.middleware';
import {
  adminListAllDocuments,
  adminStats,
  refreshSummary,
} from '../controllers/admin.controller';

const router = Router();

router.use(protect, adminOnly);

router.get('/documents', adminListAllDocuments);
router.get('/stats', adminStats);
router.post('/refresh-summary/:id', refreshSummary);

export default router;