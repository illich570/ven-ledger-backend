import type { NextFunction, Request, Response } from 'express';

import logger from '../../infrastructure/logger/pino-logger.js';

export const errorHandler = (
  error: { message: string; status: number; details?: Array<string> },
  request: Request,
  response: Response,
  _next: NextFunction,
) => {
  logger.error({
    message: error.message,
    status: error.status || 500,
    method: request.method,
    url: request.originalUrl,
    timestamp: new Date().toISOString(),
  });
  console.error('Error:', error.message);
  response.status(error.status).json({
    status: 'error',
    message: error.message || 'Internal Server Error',
    details: error.details || undefined,
  });
};
