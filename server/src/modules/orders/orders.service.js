import { prisma } from '../../libs/prisma.js';

/**
 * Creates a new order for a user.
 * @param {number} userId
 * @param {import('../../shared/types/orders.js').OrderPayload} payload
 */
export const createOrder = async (userId, payload) => {
  const productIds = payload.items.map((item) => item.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
  });
  if (products.length !== payload.items.length) {
    const error = new Error('One or more products are invalid');
    error.status = 400;
    throw error;
  }
  let total = 0;
  const orderItems = payload.items.map((item) => {
    const product = products.find((p) => p.id === item.productId);
    if (!product || product.stock < item.quantity) {
      const error = new Error(`Insufficient stock for product ${item.productId}`);
      error.status = 400;
      throw error;
    }
    const price = Number(product.price);
    total += price * item.quantity;
    return {
      productId: product.id,
      quantity: item.quantity,
      price,
    };
  });

  const order = await prisma.$transaction(async (tx) => {
    for (const item of orderItems) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      });
    }
    return tx.order.create({
      data: {
        userId,
        total,
        shippingName: payload.shippingName,
        shippingPhone: payload.shippingPhone,
        shippingAddr: payload.shippingAddr,
        orderItems: {
          create: orderItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: { orderItems: true },
    });
  });

  return {
    ...order,
    total: Number(order.total),
    orderItems: order.orderItems.map((item) => ({
      ...item,
      price: Number(item.price),
    })),
  };
};

/**
 * Lists orders for a user.
 * @param {number} userId
 */
export const listOrders = (userId) =>
  prisma.order.findMany({
    where: { userId },
    include: { orderItems: { include: { product: true } } },
    orderBy: { createdAt: 'desc' },
  }).then((orders) =>
    orders.map((order) => ({
      ...order,
      total: Number(order.total),
      orderItems: order.orderItems.map((item) => ({
        ...item,
        price: Number(item.price),
      })),
    }))
  );

/**
 * Lists all orders (admin).
 */
export const listAllOrders = () =>
  prisma.order.findMany({
    include: { orderItems: { include: { product: true } }, user: true },
    orderBy: { createdAt: 'desc' },
  }).then((orders) =>
    orders.map((order) => ({
      ...order,
      total: Number(order.total),
      orderItems: order.orderItems.map((item) => ({
        ...item,
        price: Number(item.price),
      })),
    }))
  );

/**
 * Updates order status (admin).
 */
export const updateOrderStatus = (id, status) =>
  prisma.order.update({
    where: { id },
    data: { status },
    include: { orderItems: { include: { product: true } }, user: true },
  }).then((order) => ({
    ...order,
    total: Number(order.total),
    orderItems: order.orderItems.map((item) => ({
      ...item,
      price: Number(item.price),
    })),
  }));
