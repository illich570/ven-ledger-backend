import type { User } from '../../../domain/entities/user.entity.js';
import type { FileStoragePort } from '../../../domain/ports/file-storage.port.js';
import type { UserRepository } from '../../../domain/ports/user-repository.port.js';

const MIME_TO_EXT: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
};

export interface UploadLogoUserUseCaseInput {
  userId: string;
  buffer: Buffer;
  mimetype: string;
}

export class UploadLogoUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly fileStorage: FileStoragePort,
    private readonly bucketName: string,
  ) {}
  async execute(input: UploadLogoUserUseCaseInput): Promise<User> {
    const extension = MIME_TO_EXT[input.mimetype] ?? 'jpg';
    const now = new Date();
    const timestamp = `${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}-${now.getFullYear()}`;
    const keyName = `${input.userId}-logo-${timestamp}.${extension}`;
    await this.fileStorage.putObject({
      bucket: this.bucketName,
      key: keyName,
      body: input.buffer,
      contentType: input.mimetype,
    });
    return this.userRepository.uploadLogo({
      userId: input.userId,
      keyName,
    });
  }
}
