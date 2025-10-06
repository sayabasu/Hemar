import { prisma } from '../../libs/prisma.js';

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
  return prisma.product.findMany({ where, orderBy: { createdAt: 'desc' } });
};

/**
 * Retrieves a product by id.
 * @param {number} id
 * @returns {Promise<import('../../shared/types/products.js').Product | null>}
 */
export const getProduct = (id) => prisma.product.findUnique({ where: { id } });

/**
 * Creates a new product.
 * @param {Omit<import('../../shared/types/products.js').Product, 'id'> & {price: number}} payload
 */
export const createProduct = (payload) =>
  prisma.product.create({
    data: payload,
  });

/**
 * Updates an existing product.
 * @param {number} id
 * @param {Partial<import('../../shared/types/products.js').Product>} payload
 */
export const updateProduct = (id, payload) =>
  prisma.product.update({
    where: { id },
    data: payload,
  });

/**
 * Deletes a product by id.
 * @param {number} id
 */
export const deleteProduct = (id) => prisma.product.delete({ where: { id } });
