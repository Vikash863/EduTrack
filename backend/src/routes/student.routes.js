import express from 'express';
import {
  addStudent,
  getStudents,
  getStudent,
  updateStudent,
  deleteStudent,
} from '../controllers/student.controller.js';
import auth from '../middlewares/authMiddleware.js';
import { protect, authorize } from '../middlewares/rbacMiddleware.js';
import { validateStudent, validateObjectId, sanitizeInput } from '../middlewares/validation.middleware.js';

const router = express.Router();

// ============================================
// STUDENT ROUTES
// ============================================

// Add Student (Protected - Admin/Teacher only)
router.post(
  '/',
  sanitizeInput,
  validateStudent,
  protect,
  authorize('teacher', 'admin'),
  addStudent
);

// Get All Students
router.get(
  '/',
  sanitizeInput,
  getStudents
);

// Get Single Student
router.get(
  '/:id',
  sanitizeInput,
  validateObjectId,
  getStudent
);

// Update Student (Protected)
router.put(
  '/:id',
  sanitizeInput,
  validateObjectId,
  validateStudent,
  protect,
  authorize('teacher', 'admin'),
  updateStudent
);

// Delete Student (Protected - Admin only)
router.delete(
  '/:id',
  sanitizeInput,
  validateObjectId,
  protect,
  authorize('admin'),
  deleteStudent
);

export default router;
