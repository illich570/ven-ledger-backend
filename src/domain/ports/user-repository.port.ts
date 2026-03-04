import type { User } from '../entities/user.entity.js';

export interface UploadLogoUserInput {
  userId: string;
  keyName: string;
}

export interface UserRepository {
  uploadLogo(input: UploadLogoUserInput): Promise<User>;
}
