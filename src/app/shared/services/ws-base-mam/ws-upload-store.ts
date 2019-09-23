import { Subject } from 'rxjs/Subject';

import { HttpClient } from '@angular/common/http';

import { WsUploadStoreModel, WsUploadStoreContentItem } from './ws-upload-store-model';
import { FileUploader } from 'ng2-file-upload';

export interface IWsUploadStore {
  type: WsUploadStoreType;
  name: string;
  url: string;
  hostName: string;
  folderName: string;
  uploader: any;
  http: HttpClient;
  region: string;
  state: StoreState;
  roleArn: string;

  uploadStartedSubject: Subject<boolean>;
  uploadPausedSubject: Subject<boolean>;
  uploadResumedSubject: Subject<boolean>;
  uploadCanceledSubject: Subject<boolean>;
  uploadCompletedSubject: Subject<FileUploader>;

  init(): Promise<any>;
  check(): Promise<any>;
  upload(): void;
  abort(): void;
  list(): Promise<WsUploadStoreModel>;
  dispose();
}

export class WsUploadStoreFile {
  public name: string;
  public size: number;
}

export enum WsUploadStoreType {
  Simple = 'Simple',
  AWS = 'AWS'
}

export abstract class WsGenericUploadStore implements IWsUploadStore, IDisposable {
  public type: WsUploadStoreType;
  public name: string;
  public url: string;
  public hostName: string;
  public folderName: string;
  public uploader: FileUploader;
  public http: HttpClient;
  public region: string;
  public state: StoreState;
  public roleArn: string;

  public uploadStartedSubject: Subject<boolean> = new Subject<boolean>();
  public uploadPausedSubject: Subject<boolean> = new Subject<boolean>();
  public uploadResumedSubject: Subject<boolean> = new Subject<boolean>();
  public uploadCanceledSubject: Subject<boolean> = new Subject<boolean>();
  public uploadCompletedSubject: Subject<FileUploader> = new Subject<FileUploader>();

  public abstract init(): Promise<any>;
  public abstract async check(): Promise<any>;
  public abstract upload(): void;
  public abstract abort(): void;
  public abstract async list(): Promise<WsUploadStoreModel>;
  public abstract dispose();
}

export enum StoreState {
  Undefined,
  Accessible,
  NotAccessible
}
