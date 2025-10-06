import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { env } from '../../config/env.js';

const SALT_ROUNDS = 10;

/**
 * Hashes raw password text using bcrypt.
 * @param {string} password
 * @returns {Promise<string>}
 */
export const hashPassword = (password) => bcrypt.hash(password, SALT_ROUNDS);

/**
 * Validates whether the plaintext password matches the stored hash.
 * @param {string} password
 * @param {string} hash
 * @returns {Promise<boolean>}
 */
export const validatePassword = (password, hash) => bcrypt.compare(password, hash);

/**
 * Generates a signed JWT for the provided user payload.
 * @param {import('../../shared/types/auth.js').AuthUser} user
 * @returns {import('../../shared/types/auth.js').AuthToken}
 */
export const generateToken = (user) => ({
  token: jwt.sign(user, env.jwtSecret, { expiresIn: env.jwtExpiresIn }),
  expiresIn: env.jwtExpiresIn,
});
