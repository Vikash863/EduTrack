import express from 'express';
import {
  getStudentPerformance,
  getSubjectAverages,
  getSemesterComparison,
  getTopPerformers,
} from '../controllers/analytics.controller.js';

const router = express.Router();

router.get('/student/:studentId', getStudentPerformance);
router.get('/subject-averages', getSubjectAverages);
router.get('/semester/:studentId', getSemesterComparison);
router.get('/top-performers', getTopPerformers);

export default router;
