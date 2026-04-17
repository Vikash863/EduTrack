import express from 'express';
import {
  addSubject,
  getSubjects,
  getSubject,
  updateSubject,
  deleteSubject,
} from '../controllers/subject.controller.js';
import auth from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', auth, addSubject);
router.get('/', getSubjects);
router.get('/:id', getSubject);
router.put('/:id', auth, updateSubject);
router.delete('/:id', auth, deleteSubject);

export default router;
