import type { NextFunction, Request, Response } from 'express';
import type { Logger } from 'pino';

type ErrorWithStatus = Error & {
  status?: number;
  details?: Array<string>;
};

export function createErrorHandler(logger: Logger) {
  return (
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
    response.status(status).json({
      status: 'error',
      message: error.message || 'Internal Server Error',
      details:
        'details' in error && Array.isArray(error.details)
          ? error.details
          : undefined,
    });
  };
}
