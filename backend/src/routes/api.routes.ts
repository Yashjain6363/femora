import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import {
  periodController,
  cravingController,
  symptomController,
  wellnessController,
  appointmentController,
  dashboardController,
} from '../controllers/resources.controller';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Dashboard
router.get('/dashboard', dashboardController.getSummary);

// Period tracking
router.get('/periods', periodController.getAll);
router.post('/periods', periodController.create);
router.put('/periods/:id', periodController.update);
router.delete('/periods/:id', periodController.delete);

// Craving journal
router.get('/cravings', cravingController.getAll);
router.post('/cravings', cravingController.create);
router.get('/cravings/suggestions/:category', cravingController.getSuggestions);
router.put('/cravings/:id', cravingController.update);
router.delete('/cravings/:id', cravingController.delete);

// Symptom journal
router.get('/symptoms', symptomController.getAll);
router.post('/symptoms', symptomController.create);
router.put('/symptoms/:id', symptomController.update);
router.delete('/symptoms/:id', symptomController.delete);

// Wellness entries
router.get('/wellness', wellnessController.getAll);
router.get('/wellness/today', wellnessController.getToday);
router.post('/wellness', wellnessController.upsert);
router.put('/wellness/:id', wellnessController.update);
router.delete('/wellness/:id', wellnessController.delete);

// Appointments
router.get('/appointments', appointmentController.getAll);
router.post('/appointments', appointmentController.create);
router.put('/appointments/:id', appointmentController.update);
router.delete('/appointments/:id', appointmentController.delete);

export default router;
