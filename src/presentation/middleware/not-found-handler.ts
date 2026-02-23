import type { NextFunction, Request, Response } from 'express';

import { AppError } from '../../infrastructure/app-error.js';

function handleNotFound(
  _request: Request,
  _response: Response,
  next: NextFunction,
): void {
  next(new AppError('Route not found', 404));
}

export function createNotFoundHandler() {
  return handleNotFound;
}
