import { logger } from '../utils/logger.js';

export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  const errors = err.errors || [message];

  logger.error(`[HTTP ${req.method} ${req.originalUrl}] - ${message}`, {
    statusCode,
    stack: err.stack,
    ip: req.ip,
  });

  res.status(statusCode).json({
    success: false,
    message: message,
    errors: errors,
  });
};
