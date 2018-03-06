import { FileUploader } from 'ng2-file-upload';
import { WsUploadStore } from '../shared/services/ws-base-mam/ws-upload-store';
import { UUID } from 'angular2-uuid';
import { ManagedUpload } from 'aws-sdk/clients/s3';

export class UploadModel {
  public id: UUID;
  public name: string;
  public store: WsUploadStore;
  public uploadProgress: number;
  public upload: ManagedUpload;
  constructor() {
    this.id = UUID.UUID();
  }
}
