import { prisma } from '../../libs/prisma.js';
import { env } from '../../config/env.js';

const removeTrailingSlash = (value) => value.replace(/\/+$/, '');

const toAbsolutePath = (value) => {
  const trimmed = String(value).trim();
  if (!trimmed) {
    return '';
  }
  if (trimmed.startsWith('/')) {
    return trimmed;
  }
  const firstSlashIndex = trimmed.indexOf('/');
  if (firstSlashIndex > -1) {
    const potentialHost = trimmed.slice(0, firstSlashIndex);
    if (potentialHost.includes(':')) {
      const path = trimmed.slice(firstSlashIndex);
      return path.startsWith('/') ? path : `/${path}`;
    }
  }
  return `/${trimmed}`;
};

const ensurePublicImageUrl = (value) => {
  if (!value) {
    return value;
  }
  try {
    return new URL(value).href;
  } catch (error) {
    const base = removeTrailingSlash(env.storage.publicUrl);
    const path = toAbsolutePath(value);
    return path ? `${base}${path}` : base;
  }
};

const mapProduct = (product) => (product ? { ...product, imageUrl: ensurePublicImageUrl(product.imageUrl) } : product);

/**
 * Lists products with optional search.
 * @param {{search?: string}} params
 * @returns {Promise<import('../../shared/types/products.js').Product[]>}
 */
export const listProducts = async ({ search }) => {
  const where = search
    ? {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { brand: { contains: search, mode: 'insensitive' } },
        ],
      }
    : undefined;
  const products = await prisma.product.findMany({ where, orderBy: { createdAt: 'desc' } });
  return products.map(mapProduct);
};

/**
 * Retrieves a product by id.
 * @param {number} id
 * @returns {Promise<import('../../shared/types/products.js').Product | null>}
 */
export const getProduct = async (id) => {
  const product = await prisma.product.findUnique({ where: { id } });
  return mapProduct(product);
};

/**
 * Creates a new product.
 * @param {Omit<import('../../shared/types/products.js').Product, 'id'> & {price: number}} payload
 */
export const createProduct = async (payload) => {
  const product = await prisma.product.create({
    data: payload,
  });
  return mapProduct(product);
};

/**
 * Updates an existing product.
 * @param {number} id
 * @param {Partial<import('../../shared/types/products.js').Product>} payload
 */
export const updateProduct = async (id, payload) => {
  const product = await prisma.product.update({
    where: { id },
    data: payload,
  });
  return mapProduct(product);
};

/**
 * Deletes a product by id.
 * @param {number} id
 */
export const deleteProduct = (id) => prisma.product.delete({ where: { id } });
