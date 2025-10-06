import {
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from './products.service.js';
import { recordActivity } from '../activities/activities.service.js';
import { uploadProductImage } from './productImages.service.js';

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export const index = async (req, res, next) => {
  try {
    const products = await listProducts({ search: req.query.search });
    res.json({ products });
  } catch (error) {
    next(error);
  }
};

export const show = async (req, res, next) => {
  try {
    const product = await getProduct(Number(req.params.id));
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ product });
  } catch (error) {
    next(error);
  }
};

export const store = async (req, res, next) => {
  try {
    const product = await createProduct(req.body);
    await recordActivity({
      type: 'product.created',
      message: `Product ${product.name} created`,
      metadata: { productId: product.id },
    });
    res.status(201).json({ product });
  } catch (error) {
    next(error);
  }
};

export const uploadImage = async (req, res, next) => {
  try {
    if (!req.file) {
      const error = new Error('An image file is required for upload.');
      error.status = 400;
      throw error;
    }

    const { fileUrl } = await uploadProductImage({
      fileName: req.file.originalname,
      contentType: req.file.mimetype,
      buffer: req.file.buffer,
    });
    res.status(201).json({ fileUrl });
  } catch (error) {
    next(error);
  }
};

export const update = async (req, res, next) => {
  try {
    const product = await updateProduct(Number(req.params.id), req.body);
    await recordActivity({
      type: 'product.updated',
      message: `Product ${product.name} updated`,
      metadata: { productId: product.id },
    });
    res.json({ product });
  } catch (error) {
    next(error);
  }
};

export const destroy = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const existing = await getProduct(id);
    if (!existing) {
      return res.status(404).json({ message: 'Product not found' });
    }
    await deleteProduct(Number(req.params.id));
    await recordActivity({
      type: 'product.deleted',
      message: `Product ${existing.name} deleted`,
      metadata: { productId: existing.id },
    });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
