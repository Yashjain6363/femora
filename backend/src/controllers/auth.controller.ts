import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service';
import { registerSchema, loginSchema } from '../validations/auth.validation';
import type { AuthRequest } from '../middleware/auth';
import { env } from '../config/env';

const isProduction = env.NODE_ENV === 'production';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: isProduction,
  sameSite: (isProduction ? 'none' : 'strict') as 'none' | 'strict',
  path: '/',
};

export const authController = {
  register: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const input = registerSchema.parse(req.body);
      const { user, accessToken, refreshToken } = await authService.register(input);

      res
        .cookie('accessToken', accessToken, {
          ...COOKIE_OPTIONS,
          maxAge: 15 * 60 * 1000, // 15 minutes
        })
        .cookie('refreshToken', refreshToken, {
          ...COOKIE_OPTIONS,
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        })
        .status(201)
        .json({
          success: true,
          message: 'Account created successfully',
          data: { user, accessToken }, // accessToken also in body for non-cookie clients
        });
    } catch (error) {
      next(error);
    }
  },

  login: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const input = loginSchema.parse(req.body);
      const { user, accessToken, refreshToken } = await authService.login(input);

      res
        .cookie('accessToken', accessToken, {
          ...COOKIE_OPTIONS,
          maxAge: 15 * 60 * 1000,
        })
        .cookie('refreshToken', refreshToken, {
          ...COOKIE_OPTIONS,
          maxAge: 7 * 24 * 60 * 60 * 1000,
        })
        .json({
          success: true,
          message: 'Login successful',
          data: { user, accessToken },
        });
    } catch (error) {
      next(error);
    }
  },

  getProfile: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const user = await authService.getProfile(req.userId!);
      res.json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  },

  logout: (_req: Request, res: Response) => {
    res
      .clearCookie('accessToken', COOKIE_OPTIONS)
      .clearCookie('refreshToken', COOKIE_OPTIONS)
      .json({ success: true, message: 'Logged out successfully' });
  },
};
