import type { Request, Response } from 'express';

import type { UploadLogoUserUseCase } from '../../application/users/use-cases/upload-logo-user.use-case.js';
import { ValidationError } from '../../infrastructure/validation-error.js';

export function createUserHandlers(uploadLogo: UploadLogoUserUseCase) {
  return {
    uploadLogo: async (request: Request, response: Response): Promise<void> => {
      if (!request.file) {
        throw new ValidationError('Logo required', [
          'Send a file in field "logo" (multipart/form-data)',
        ]);
      }
      const user = await uploadLogo.execute({
        userId: request.auth!.user.id,
        buffer: request.file.buffer,
        mimetype: request.file.mimetype,
      });
      response.status(200).json(user);
    },
  };
}
