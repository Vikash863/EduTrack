import express from 'express';
import {
  getStudentPerformance,
  getSubjectAverages,
  getSemesterComparison,
  getTopPerformers,
  getPassFailStats,
  getDashboardAnalytics,
  getStudentStatsByBranch,
  getSemesterTrends,
} from '../controllers/analytics.controller.js';

const router = express.Router();

router.get('/student/:studentId', getStudentPerformance);
router.get('/subject-averages', getSubjectAverages);
router.get('/semester/:studentId', getSemesterComparison);
router.get('/semester-trends/:studentId', getSemesterTrends);
router.get('/top-performers', getTopPerformers);
router.get('/pass-fail', getPassFailStats);
router.get('/dashboard', getDashboardAnalytics);
router.get('/branch-stats', getStudentStatsByBranch);

export default router;
