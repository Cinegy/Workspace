import { WsUploadStore } from './ws-upload-store';

export class WsMamConnection {
  public name: string;
  public mamVersion: string;
  public mamEndpoint: string;
  public casEndpoint: string;
  public dbServer: string;
  public dbName: string;
  public thumbnailServer: string;
  public uploadStores: WsUploadStore[];
  public domains: string;
  public username: string;
  public password: string;
  public domain: string;
  public loginTime: Date;
}
