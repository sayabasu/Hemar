import { Router } from 'express';
import { authenticate, authorize } from '../../middlewares/auth.js';
import { index, show, store, update, destroy } from './products.controller.js';

const router = Router();

/**
 * @openapi
 * /api/products:
 *   get:
 *     tags: [Products]
 *     summary: List all mobile phones
 */
router.get('/', index);

/**
 * @openapi
 * /api/products/{id}:
 *   get:
 *     tags: [Products]
 *     summary: Retrieve a product by id
 */
router.get('/:id', show);

router.post('/', authenticate, authorize('ADMIN'), store);
router.put('/:id', authenticate, authorize('ADMIN'), update);
router.delete('/:id', authenticate, authorize('ADMIN'), destroy);

export default router;
