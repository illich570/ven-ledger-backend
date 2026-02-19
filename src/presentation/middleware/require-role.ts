import type { NextFunction, Request, Response } from 'express';

import { AppError } from '../../infrastructure/app-error.js';

export function createRequireRole(...allowedRoles: string[]) {
  return function requireRole(
    request: Request,
    _response: Response,
    next: NextFunction,
  ): void {
    const userRole = request.auth?.user?.role;
    if (!userRole || !allowedRoles.includes(userRole)) {
      next(new AppError('Forbidden', 403));
      return;
    }
    next();
  };
}
