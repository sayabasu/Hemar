import { logger } from '../libs/logger.js';

// eslint-disable-next-line no-unused-vars
export const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;
  const response = {
    message: err.message || 'Internal Server Error',
    details: err.details || undefined,
  };
  logger.error({ message: 'request_failed', status, error: err.message, stack: err.stack });
  res.status(status).json(response);
};
