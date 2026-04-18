import express from 'express';
import { generateStudentReport, generateTranscript } from '../controllers/report.controller.js';

const router = express.Router();

// Generate student academic report
router.get('/student/:studentId', generateStudentReport);

// Generate transcript
router.get('/transcript/:studentId', generateTranscript);

export default router;
