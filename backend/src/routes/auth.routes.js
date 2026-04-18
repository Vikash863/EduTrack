import express from 'express';
import { registerTeacher, loginTeacher, getTeacherProfile } from '../controllers/auth.controller.js';
import { protect } from '../middlewares/rbacMiddleware.js';
import { validateAuthCredentials, validateTeacher, sanitizeInput } from '../middlewares/validation.middleware.js';

const router = express.Router();

// ============================================
// AUTHENTICATION ROUTES
// ============================================

// Register Teacher
router.post(
  '/register',
  sanitizeInput,
  validateTeacher,
  registerTeacher
);

// Login Teacher
router.post(
  '/login',
  sanitizeInput,
  validateAuthCredentials,
  loginTeacher
);

// Get Teacher Profile (Protected)
router.get(
  '/profile',
  sanitizeInput,
  protect,
  getTeacherProfile
);

export default router;
