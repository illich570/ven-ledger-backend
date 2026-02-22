export interface FileStoragePort {
  putObject(params: {
    bucket: string;
    key: string;
    body: Buffer;
    contentType: string;
  }): Promise<object>;
}
