import type { NextFunction, Request, Response } from 'express';
import type { Logger } from 'pino';

type ErrorWithStatus = Error & {
  status?: number;
  details?: Array<string>;
};

const SENSITIVE_HEADERS = new Set([
  'authorization',
  'cookie',
  'x-api-key',
  'x-auth-token',
]);

function sanitizedRequestContext(request: Request): Record<string, unknown> {
  const headers: Record<string, string> = {};
  for (const [key, value] of Object.entries(request.headers)) {
    if (value !== undefined && !SENSITIVE_HEADERS.has(key.toLowerCase())) {
      headers[key] =
        typeof value === 'string' ? value : (value as string[]).join(', ');
    }
  }
  return {
    requestId:
      'id' in request ? (request as Request & { id?: string }).id : undefined,
    method: request.method,
    path: request.path,
    url: request.originalUrl?.split('?')[0],
    headers,
  };
}

export function createErrorHandler(logger: Logger) {
  return (
    error: ErrorWithStatus,
    request: Request,
    response: Response,
    _next: NextFunction,
  ): void => {
    const status = typeof error.status === 'number' ? error.status : 500;
    const logLevel = status >= 500 ? 'error' : status >= 400 ? 'warn' : 'info';
    const context = sanitizedRequestContext(request);

    if (logLevel === 'error') {
      logger.error(
        {
          err: error,
          status,
          ...context,
        },
        error.message || 'Internal Server Error',
      );
    } else {
      logger[logLevel](
        {
          err: error,
          status,
          ...context,
        },
        error.message || 'Request error',
      );
    }

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
