import express from 'express';
import { authController } from '../controllers/authController';
import { educationController } from '../controllers/educationController';
import { auth } from '../middleware/auth';

export const router = express.Router();

// Welcome route
router.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Educational Platform API' });
});

// Auth routes
router.post('/auth/signup', authController.signup);
router.post('/auth/login', authController.login);
router.get('/auth/profile', auth, authController.getProfile);

// Education routes
router.get('/education/levels', educationController.getEducationLevels);
router.get('/education/subjects/:levelId', auth, educationController.getSubjectsByLevel);
router.get('/education/lessons/:subjectId/:lessonId', auth, educationController.getLessonWithAI);
router.get('/education/quiz/:subjectId/:lessonId', auth, educationController.generateQuiz);
