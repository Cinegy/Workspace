import { FileUploader } from 'ng2-file-upload';
import { IWsUploadStore } from '../shared/services/ws-base-mam/ws-upload-store';
import { UUID } from 'angular2-uuid';

export class UploadModel {
    public id: UUID;
    public name: string;
    public store: IWsUploadStore;
    public uploader: FileUploader;
    public uploadProgress: number;
    public file: File;
  
    constructor() {
      this.id = UUID.UUID();
    }
  }