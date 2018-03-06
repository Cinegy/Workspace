export class WsUploadStore {
  public name: string;
  public url: string;
  public bucket: AWS.S3;
  public bucketName: string;
  public bucketFolder: string;
}
