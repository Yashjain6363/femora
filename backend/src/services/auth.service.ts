import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/prisma';
import { env } from '../config/env';
import { createError } from '../middleware/errorHandler';
import type { RegisterInput, LoginInput } from '../validations/auth.validation';

const BCRYPT_ROUNDS = 12;

export const authService = {
  async register(input: RegisterInput) {
    // Check duplicate email
    const existing = await prisma.user.findUnique({
      where: { email: input.email },
      select: { id: true },
    });

    if (existing) {
      throw createError('An account with this email already exists', 409);
    }

    const hashedPassword = await bcrypt.hash(input.password, BCRYPT_ROUNDS);

    const user = await prisma.user.create({
      data: {
        name: input.name,
        email: input.email,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    const { accessToken, refreshToken } = generateTokens(user.id, user.email);

    return { user, accessToken, refreshToken };
  },

  async login(input: LoginInput) {
    const user = await prisma.user.findUnique({
      where: { email: input.email },
    });

    // Constant-time comparison: always compare hash even if user not found
    const dummyHash = '$2b$12$invalidhashfortimingattackprevention00000000000';
    const passwordToCheck = user?.password ?? dummyHash;
    const isValid = await bcrypt.compare(input.password, passwordToCheck);

    if (!user || !isValid) {
      throw createError('Invalid email or password', 401);
    }

    const { accessToken, refreshToken } = generateTokens(user.id, user.email);

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
      accessToken,
      refreshToken,
    };
  },

  async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw createError('User not found', 404);
    }

    return user;
  },
};

function generateTokens(userId: string, email: string) {
  const accessToken = jwt.sign({ userId, email }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  } as jwt.SignOptions);

  const refreshToken = jwt.sign({ userId, email }, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN,
  } as jwt.SignOptions);

  return { accessToken, refreshToken };
}
