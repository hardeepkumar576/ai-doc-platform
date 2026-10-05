import { Router } from 'express';
import { protect } from '../middleware/auth.middleware';
import { upload } from '../middleware/upload.middleware';
import {
  uploadDocument,
  listDocuments,
  getDocument,
  deleteDocument,
  searchDocuments,
} from '../controllers/document.controller';

const router = Router();

router.use(protect); // sab routes auth ke peeche

router.post('/upload', upload.single('file'), uploadDocument);
router.get('/', listDocuments);
router.get('/search', searchDocuments);   // 👈 IMPORTANT: /:id se PEHLE
router.get('/:id', getDocument);
router.delete('/:id', deleteDocument);

export default router;