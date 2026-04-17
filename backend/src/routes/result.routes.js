import express from 'express';
import {
  addResult,
  getResults,
  getResult,
  updateResult,
  deleteResult,
} from '../controllers/result.controller.js';
import auth from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', auth, addResult);
router.get('/', getResults);
router.get('/:id', getResult);
router.put('/:id', auth, updateResult);
router.delete('/:id', auth, deleteResult);

export default router;
