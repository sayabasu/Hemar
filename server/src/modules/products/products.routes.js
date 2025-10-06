import { Router } from 'express';
import { authenticate, authorize } from '../../middlewares/auth.js';
import { index, show, store, update, destroy, requestImageUpload } from './products.controller.js';

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

/**
 * @openapi
 * /api/products/images/upload:
 *   post:
 *     tags: [Products]
 *     summary: Generate a presigned URL for uploading a product image
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fileName
 *               - contentType
 *             properties:
 *               fileName:
 *                 type: string
 *               contentType:
 *                 type: string
 *                 example: image/jpeg
 *     responses:
 *       201:
 *         description: Presigned upload URL generated
 *       400:
 *         description: Validation error
 */
router.post('/images/upload', authenticate, authorize('ADMIN'), requestImageUpload);

router.post('/', authenticate, authorize('ADMIN'), store);
router.put('/:id', authenticate, authorize('ADMIN'), update);
router.delete('/:id', authenticate, authorize('ADMIN'), destroy);

export default router;
