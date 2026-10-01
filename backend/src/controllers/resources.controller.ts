import { Response, NextFunction } from 'express';
import type { AuthRequest } from '../middleware/auth';
import { periodService } from '../services/period.service';
import { createPeriodSchema, updatePeriodSchema } from '../validations/resources.validation';

// Helper: safely extract route param as string
const pid = (req: AuthRequest): string => String(req.params['id']);

export const periodController = {
  getAll: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const data = await periodService.getAll(req.userId!);
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  },

  create: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const input = createPeriodSchema.parse(req.body);
      const entry = await periodService.create(req.userId!, input);
      res.status(201).json({ success: true, data: entry });
    } catch (error) {
      next(error);
    }
  },

  update: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const input = updatePeriodSchema.parse(req.body);
      const entry = await periodService.update(req.userId!, pid(req), input);
      res.json({ success: true, data: entry });
    } catch (error) {
      next(error);
    }
  },

  delete: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const result = await periodService.delete(req.userId!, pid(req));
      res.json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  },
};

// ─── Craving Controller ───────────────────────────────────────────────────
import { cravingService } from '../services/craving.service';
import { createCravingSchema, updateCravingSchema } from '../validations/resources.validation';

export const cravingController = {
  getAll: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const data = await cravingService.getAll(req.userId!);
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  },

  getSuggestions: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const data = await cravingService.getSuggestions((req.params.category as string).toUpperCase());
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  },

  create: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const input = createCravingSchema.parse(req.body);
      const entry = await cravingService.create(req.userId!, input);
      res.status(201).json({ success: true, data: entry });
    } catch (error) {
      next(error);
    }
  },

  update: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const input = updateCravingSchema.parse(req.body);
      const entry = await cravingService.update(req.userId!, pid(req), input);
      res.json({ success: true, data: entry });
    } catch (error) {
      next(error);
    }
  },

  delete: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const result = await cravingService.delete(req.userId!, pid(req));
      res.json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  },
};

// ─── Symptom Controller ───────────────────────────────────────────────────
import { symptomService, wellnessService } from '../services/health.service';
import {
  createSymptomSchema,
  updateSymptomSchema,
  createWellnessSchema,
  updateWellnessSchema,
} from '../validations/resources.validation';

export const symptomController = {
  getAll: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const data = await symptomService.getAll(req.userId!);
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  },

  create: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const input = createSymptomSchema.parse(req.body);
      const entry = await symptomService.create(req.userId!, input);
      res.status(201).json({ success: true, data: entry });
    } catch (error) {
      next(error);
    }
  },

  update: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const input = updateSymptomSchema.parse(req.body);
      const entry = await symptomService.update(req.userId!, pid(req), input);
      res.json({ success: true, data: entry });
    } catch (error) {
      next(error);
    }
  },

  delete: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const result = await symptomService.delete(req.userId!, pid(req));
      res.json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  },
};

export const wellnessController = {
  getAll: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const data = await wellnessService.getAll(req.userId!);
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  },

  getToday: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const data = await wellnessService.getToday(req.userId!);
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  },

  upsert: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const input = createWellnessSchema.parse(req.body);
      const entry = await wellnessService.upsert(req.userId!, input);
      res.json({ success: true, data: entry });
    } catch (error) {
      next(error);
    }
  },

  update: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const input = updateWellnessSchema.parse(req.body);
      const entry = await wellnessService.update(req.userId!, pid(req), input);
      res.json({ success: true, data: entry });
    } catch (error) {
      next(error);
    }
  },

  delete: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const result = await wellnessService.delete(req.userId!, pid(req));
      res.json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  },
};

// ─── Appointment Controller ───────────────────────────────────────────────
import { appointmentService } from '../services/appointment.service';
import {
  createAppointmentSchema,
  updateAppointmentSchema,
} from '../validations/resources.validation';

export const appointmentController = {
  getAll: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const data = await appointmentService.getAll(req.userId!);
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  },

  create: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const input = createAppointmentSchema.parse(req.body);
      const entry = await appointmentService.create(req.userId!, input);
      res.status(201).json({ success: true, data: entry });
    } catch (error) {
      next(error);
    }
  },

  update: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const input = updateAppointmentSchema.parse(req.body);
      const entry = await appointmentService.update(req.userId!, pid(req), input);
      res.json({ success: true, data: entry });
    } catch (error) {
      next(error);
    }
  },

  delete: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const result = await appointmentService.delete(req.userId!, pid(req));
      res.json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  },
};

// ─── Dashboard Controller ─────────────────────────────────────────────────
import { dashboardService } from '../services/dashboard.service';

export const dashboardController = {
  getSummary: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const data = await dashboardService.getSummary(req.userId!);
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  },
};
