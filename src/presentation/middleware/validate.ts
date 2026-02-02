import type { NextFunction, Request, Response } from 'express';
import type { ZodType } from 'zod';
import { ZodError } from 'zod';

import { ValidationError } from '../../infrastructure/validation-error.js';

type ValidationSchemas = {
  body?: ZodType<unknown, unknown>;
  query?: ZodType<unknown, unknown>;
  params?: ZodType<unknown, unknown>;
};

export const validate =
  (schemas: ValidationSchemas) =>
  (request: Request, _response: Response, next: NextFunction) => {
    try {
      if (schemas.body) {
        request.body = schemas.body.parse(request.body) as typeof request.body;
      }
      if (schemas.query) {
        request.query = schemas.query.parse(
          request.query,
        ) as typeof request.query;
      }
      if (schemas.params) {
        request.params = schemas.params.parse(
          request.params,
        ) as typeof request.params;
      }
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const details = error.issues.map(
          issue => `${issue.path.join('.')}: ${issue.message}`,
        );
        next(new ValidationError('Validation failed', details));
      } else {
        next(error);
      }
    }
  };
