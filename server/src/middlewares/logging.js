import morgan from 'morgan';
import { logger } from '../libs/logger.js';

const stream = {
  write: (message) => {
    const log = message.trim();
    if (!log) return;
    logger.info({ message: 'http_request', log });
  },
};

export const requestLogger = morgan('combined', { stream });
