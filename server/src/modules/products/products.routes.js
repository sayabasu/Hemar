import { Router } from 'express';
import { authenticate, authorize } from '../../middlewares/auth.js';
import { index, show, store, update, destroy, uploadImage } from './products.controller.js';
import { upload } from '../../middlewares/upload.js';

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
 *     summary: Upload a product image directly to storage
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Image uploaded successfully
 *       400:
 *         description: Validation error
 */
router.post(
  '/images/upload',
  authenticate,
  authorize('ADMIN'),
  upload.single('file'),
  uploadImage,
);

router.post('/', authenticate, authorize('ADMIN'), store);
router.put('/:id', authenticate, authorize('ADMIN'), update);
router.delete('/:id', authenticate, authorize('ADMIN'), destroy);

export default router;
