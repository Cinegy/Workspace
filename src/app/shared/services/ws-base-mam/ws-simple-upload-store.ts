import { WsGenericUploadStore, IWsUploadStore, StoreState, WsUploadStoreType } from './ws-upload-store';
import { HttpClient } from '@angular/common/http';
import { FileUploader } from 'ng2-file-upload';
import { WsUploadStoreModel, WsUploadStoreContentItem } from './ws-upload-store-model';

export class  WsSimpleUploadStore extends WsGenericUploadStore implements IWsUploadStore, IDisposable {

    constructor(public name: string, public url: string, public uploader: FileUploader, public http: HttpClient) {
      super();
      this.type =  WsUploadStoreType.Simple;
      this.state = StoreState.Undefined;
    }
  
    dispose() {
    }
  
    public init(): Promise<any> {
      return new Promise((resolve, reject) => {
        resolve();
      });
    }
  
    public check(): Promise<any> {
      return new Promise((resolve, reject) => {
        resolve();
      });
  
    }
  
    public upload(): Promise<any> {
      return new Promise((resolve, reject) => {
        this.uploader.queue[0].url = `${this.url}api/upload`;
        this.uploader.onCompleteAll = () => {
          resolve();
        };
        this.uploader.uploadAll();
      });
    }
  
    public abort(): void {
      this.uploader.cancelAll();
    }
  
    public async list(): Promise< WsUploadStoreModel> {
      const model = new  WsUploadStoreModel();
      const request = await this.http.get(`${this.url}api/upload`).forEach((data: any) => {
        data.forEach(item => {
          const contentItem = new  WsUploadStoreContentItem();
          contentItem.name = item.name;
          contentItem.size = item.length;
          model.content.push(contentItem);
        });
      });
      return model;
    }
  }