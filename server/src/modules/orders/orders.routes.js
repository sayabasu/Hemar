import { Router } from 'express';
import { authenticate, authorize } from '../../middlewares/auth.js';
import { create, mine, all, updateStatus } from './orders.controller.js';

const router = Router();

/**
 * @openapi
 * /api/orders:
 *   post:
 *     tags: [Orders]
 *     summary: Create an order from the cart
 */
router.post('/', authenticate, create);

router.get('/mine', authenticate, mine);
router.get('/', authenticate, authorize('ADMIN'), all);
router.patch('/:id/status', authenticate, authorize('ADMIN'), updateStatus);

export default router;
