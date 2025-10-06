import { prisma } from '../../libs/prisma.js';
import { hashPassword, validatePassword, generateToken } from './auth.crypto.js';

/**
 * Registers a new user.
 * @param {{email: string, password: string, name: string}} payload
 * @returns {Promise<{user: import('../../shared/types/auth.js').AuthUser, token: import('../../shared/types/auth.js').AuthToken}>}
 */
export const registerUser = async ({ email, password, name }) => {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    const error = new Error('Email already registered');
    error.status = 409;
    throw error;
  }
  const hashed = await hashPassword(password);
  const user = await prisma.user.create({
    data: {
      email,
      password: hashed,
      name,
      role: 'CUSTOMER',
    },
  });
  const token = generateToken({ id: user.id, email: user.email, name: user.name, role: user.role });
  return { user, token };
};

/**
 * Authenticates a user via email/password.
 * @param {{email: string, password: string}}
 * @returns {Promise<{user: import('../../shared/types/auth.js').AuthUser, token: import('../../shared/types/auth.js').AuthToken}>}
 */
export const loginUser = async ({ email, password }) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    const error = new Error('Invalid credentials');
    error.status = 401;
    throw error;
  }
  const valid = await validatePassword(password, user.password);
  if (!valid) {
    const error = new Error('Invalid credentials');
    error.status = 401;
    throw error;
  }
  const token = generateToken({ id: user.id, email: user.email, name: user.name, role: user.role });
  return { user, token };
};

/**
 * Fetches the authenticated user details.
 * @param {number} id
 * @returns {Promise<import('../../shared/types/auth.js').AuthUser>}
 */
export const getProfile = (id) =>
  prisma.user.findUnique({
    where: { id },
    select: { id: true, email: true, name: true, role: true, createdAt: true },
  });

export { hashPassword, validatePassword, generateToken } from './auth.crypto.js';
