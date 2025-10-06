import { Router } from 'express';
import { register, login, profile } from './auth.controller.js';
import { authenticate } from '../../middlewares/auth.js';

const router = Router();

/**
 * @openapi
 * /api/auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Register a new customer account
 */
router.post('/register', register);

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Login with email and password
 */
router.post('/login', login);

/**
 * @openapi
 * /api/auth/profile:
 *   get:
 *     tags: [Auth]
 *     summary: Get the authenticated user profile
 */
router.get('/profile', authenticate, profile);

export default router;
