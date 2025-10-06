import { createOrder, listOrders, listAllOrders, updateOrderStatus } from './orders.service.js';
import { recordActivity } from '../activities/activities.service.js';

export const create = async (req, res, next) => {
  try {
    const order = await createOrder(req.auth.id, req.body);
    await recordActivity({
      type: 'order.created',
      message: `Order ${order.id} created by user ${req.auth.email}`,
      metadata: { orderId: order.id, userId: req.auth.id },
    });
    res.status(201).json({ order });
  } catch (error) {
    next(error);
  }
};

export const mine = async (req, res, next) => {
  try {
    const orders = await listOrders(req.auth.id);
    res.json({ orders });
  } catch (error) {
    next(error);
  }
};

export const all = async (req, res, next) => {
  try {
    const orders = await listAllOrders();
    res.json({ orders });
  } catch (error) {
    next(error);
  }
};

export const updateStatus = async (req, res, next) => {
  try {
    const order = await updateOrderStatus(Number(req.params.id), req.body.status);
    await recordActivity({
      type: 'order.status',
      message: `Order ${order.id} status changed to ${order.status}`,
      metadata: { orderId: order.id, status: order.status },
    });
    res.json({ order });
  } catch (error) {
    next(error);
  }
};
