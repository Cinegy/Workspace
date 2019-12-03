import { IWsUploadStore } from './ws-upload-store';


export class WsMamConnection {
  public name: string;
  public mamVersion: string;
  public mamEndpoint: string;
  public casEndpoint: string;
  public dbServer: string;
  public dbName: string;
  public thumbnailServer: string;
  public uploadStores:IWsUploadStore[];// IWsUploadStore[];
  public domains: string;
  public username: string;
  public password: string;
  public domain: string;
  public loginTime: Date;
  public cis: WsCisConfiguration;

}

export class WsCisConfiguration {
  public cisEndpoint: string;
  public clientId: string;
  public useCis: boolean;
}
