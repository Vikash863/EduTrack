import express from 'express';
import {
  addAttendance,
  getStudentAttendance,
  getSubjectAttendance,
  updateAttendance,
  bulkAddAttendance,
  getAttendanceStats,
} from '../controllers/attendance.controller.js';
import { protect, teacherOrAdmin } from '../middlewares/rbacMiddleware.js';
import { validateAttendance, validateObjectId, sanitizeInput } from '../middlewares/validation.middleware.js';

const router = express.Router();

// ============================================
// ATTENDANCE ROUTES
// ============================================

// Add single attendance record (Protected - Teacher/Admin only)
router.post(
  '/add',
  sanitizeInput,
  validateAttendance,
  protect,
  teacherOrAdmin,
  addAttendance
);

// Get student attendance (Protected)
router.get(
  '/student/:studentId',
  sanitizeInput,
  validateObjectId,
  protect,
  getStudentAttendance
);

// Get subject attendance (Protected - Teacher/Admin only)
router.get(
  '/subject/:subjectId',
  sanitizeInput,
  validateObjectId,
  protect,
  teacherOrAdmin,
  getSubjectAttendance
);

// Update attendance (Protected - Teacher/Admin only)
router.put(
  '/update/:id',
  sanitizeInput,
  validateObjectId,
  validateAttendance,
  protect,
  teacherOrAdmin,
  updateAttendance
);

// Bulk add attendance (Protected - Teacher/Admin only)
router.post(
  '/bulk-add',
  sanitizeInput,
  protect,
  teacherOrAdmin,
  bulkAddAttendance
);

// Get attendance statistics (Protected - Teacher/Admin only)
router.get(
  '/stats',
  sanitizeInput,
  protect,
  teacherOrAdmin,
  getAttendanceStats
);

export default router;
