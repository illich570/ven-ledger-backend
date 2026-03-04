import type { NextFunction, Request, Response } from 'express';
import multer from 'multer';

import { ValidationError } from '../../infrastructure/validation-error.js';

const ALLOWED_MIMES = ['image/jpeg', 'image/png', 'image/webp'] as const;
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

const multerUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: (_request, file, callback) => {
    if (
      ALLOWED_MIMES.includes(file.mimetype as (typeof ALLOWED_MIMES)[number])
    ) {
      // eslint-disable-next-line unicorn/no-null -- multer FileFilterCallback expects null for no error
      callback(null, true);
    } else {
      callback(
        new ValidationError('Invalid image type', ['Allowed: JPEG, PNG, WebP']),
      );
    }
  },
}).single('logo');

export function uploadLogoMiddleware(
  request: Request,
  response: Response,
  next: NextFunction,
): void {
  multerUpload(request, response, (error: unknown) => {
    if (!error) return next();
    if (error instanceof multer.MulterError) {
      if (error.code === 'LIMIT_FILE_SIZE') {
        next(
          new ValidationError('File too large', [
            `Max size: ${MAX_FILE_SIZE / 1024 / 1024}MB`,
          ]),
        );
      } else if (error.code === 'LIMIT_UNEXPECTED_FILE') {
        next(
          new ValidationError('Invalid field name', ['Expected field: logo']),
        );
      } else {
        next(new ValidationError(error.message, []));
      }
    } else {
      next(error);
    }
  });
}
