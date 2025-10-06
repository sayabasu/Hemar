import { expressjwt } from 'express-jwt';
import { env } from '../config/env.js';

export const authenticate = expressjwt({
  secret: env.jwtSecret,
  algorithms: ['HS256'],
  requestProperty: 'auth',
});

export const authorize = (...roles) => (req, res, next) => {
  if (!req.auth || !roles.includes(req.auth.role)) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  return next();
};
