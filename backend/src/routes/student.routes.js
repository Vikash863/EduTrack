import express from 'express';
import {
  addStudent,
  getStudents,
  getStudent,
  updateStudent,
  deleteStudent,
} from '../controllers/student.controller.js';
import auth from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', auth, addStudent);
router.get('/', getStudents);
router.get('/:id', getStudent);
router.put('/:id', auth, updateStudent);
router.delete('/:id', auth, deleteStudent);

export default router;
