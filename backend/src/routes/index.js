import express from 'express';
import authRoutes from './auth.routes.js';
import studentRoutes from './student.routes.js';
import subjectRoutes from './subject.routes.js';
import resultRoutes from './result.routes.js';
import analyticsRoutes from './analytics.routes.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/students', studentRoutes);
router.use('/subjects', subjectRoutes);
router.use('/results', resultRoutes);
router.use('/analytics', analyticsRoutes);

// Health check
router.get('/', (req, res) => {
  res.status(200).json({ message: '✅ EduTrack API is running' });
});

export default router;
