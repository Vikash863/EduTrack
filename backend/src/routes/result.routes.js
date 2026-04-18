import express from 'express';
import {
  addResult,
  getResults,
  getResult,
  updateResult,
  deleteResult,
} from '../controllers/result.controller.js';
import { protect, authorize, teacherOrAdmin } from '../middlewares/rbacMiddleware.js';
import { validateResult, validateObjectId, sanitizeInput } from '../middlewares/validation.middleware.js';

const router = express.Router();

// ============================================
// RESULT ROUTES
// ============================================

// Add Result (Protected - Teacher/Admin only)
router.post(
  '/',
  sanitizeInput,
  validateResult,
  protect,
  teacherOrAdmin,
  addResult
);

// Get All Results
router.get(
  '/',
  sanitizeInput,
  getResults
);

// Get Single Result
router.get(
  '/:id',
  sanitizeInput,
  validateObjectId,
  getResult
);

// Update Result (Protected - Teacher/Admin only)
router.put(
  '/:id',
  sanitizeInput,
  validateObjectId,
  validateResult,
  protect,
  teacherOrAdmin,
  updateResult
);

// Delete Result (Protected - Admin only)
router.delete(
  '/:id',
  sanitizeInput,
  validateObjectId,
  protect,
  authorize('admin'),
  deleteResult
);

export default router;
