import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl as createPresignedUrl } from '@aws-sdk/s3-request-presigner';

import type { FileStoragePort } from '../../domain/ports/file-storage.port.js';

export class CloudflareFileStorageService implements FileStoragePort {
  private readonly r2Client: S3Client;

  constructor(
    cloudflareAccountId: string,
    accessKeyId: string,
    secretAccessKey: string,
  ) {
    this.r2Client = new S3Client({
      region: 'auto',
      endpoint: `https://${cloudflareAccountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey,
      },
    });
  }
  async putObject(params: {
    bucket: string;
    key: string;
    body: Buffer;
    contentType: string;
  }): Promise<object> {
    const command = new PutObjectCommand({
      Bucket: params.bucket,
      Key: params.key,
      Body: params.body,
      ContentType: params.contentType,
    });

    const response = await this.r2Client.send(command);
    return response;
  }

  async getSignedUrl(params: {
    bucket: string;
    key: string;
    expiresIn?: number;
  }): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: params.bucket,
      Key: params.key,
    });
    return createPresignedUrl(this.r2Client, command, {
      expiresIn: params.expiresIn ?? 300,
    });
  }
}
