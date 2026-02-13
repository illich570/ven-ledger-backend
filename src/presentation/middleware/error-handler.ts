import type { NextFunction, Request, Response } from 'express';

import logger from '../../infrastructure/logger/pino-logger.js';

type ErrorWithStatus = Error & {
  status?: number;
  details?: Array<string>;
};

export const errorHandler = (
  error: ErrorWithStatus,
  request: Request,
  response: Response,
  _next: NextFunction,
): void => {
  const status = typeof error.status === 'number' ? error.status : 500;
  logger.error({
    message: error.message,
    status,
    method: request.method,
    url: request.originalUrl,
    timestamp: new Date().toISOString(),
  });
  console.error('Error:', error.message);
  response.status(status).json({
    status: 'error',
    message: error.message || 'Internal Server Error',
    details:
      'details' in error && Array.isArray(error.details)
        ? error.details
        : undefined,
  });
};
