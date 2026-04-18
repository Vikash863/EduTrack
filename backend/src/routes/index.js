import express from 'express';
import authRoutes from './auth.routes.js';
import studentRoutes from './student.routes.js';
import subjectRoutes from './subject.routes.js';
import resultRoutes from './result.routes.js';
import analyticsRoutes from './analytics.routes.js';
import attendanceRoutes from './attendance.routes.js';
import reportRoutes from './report.routes.js';
import notificationRoutes from './notification.routes.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/students', studentRoutes);
router.use('/subjects', subjectRoutes);
router.use('/results', resultRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/attendance', attendanceRoutes);
router.use('/reports', reportRoutes);
router.use('/notifications', notificationRoutes);

// API root status
router.get('/', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'EduTrack API root',
    endpoints: {
      students: '/students',
      attendance: '/attendance',
      results: '/results',
      analytics: '/analytics',
    },
  });
});

export default router;
