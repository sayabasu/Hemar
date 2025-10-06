import { prisma } from '../../libs/prisma.js';
import { normalizeImageUrl } from '../../integrations/storage/filesystem.js';

const mapProduct = (product) => (product ? { ...product, imageUrl: normalizeImageUrl(product.imageUrl) } : product);

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
