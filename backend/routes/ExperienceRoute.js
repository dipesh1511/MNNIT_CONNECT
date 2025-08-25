import express from 'express';
import { createExperience, getAllExperiences } from '../controllers/ExperienceController.js';
import protect from '../middlewares/authUser.js';

const router = express.Router();

router.get('/all', getAllExperiences);
router.post('/create',protect, createExperience);

export default router;
