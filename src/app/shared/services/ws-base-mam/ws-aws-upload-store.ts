import { WsGenericUploadStore, IWsUploadStore, StoreState, WsUploadStoreType } from './ws-upload-store';
import { Subject } from 'rxjs/Subject';
import { FileUploader } from 'ng2-file-upload';
import { SimpleTimer } from 'ng2-simple-timer';
import { WsCisService } from '../ws-cis/ws-cis.service';
import { UUID } from 'angular2-uuid';
import * as AWS from 'aws-sdk';
import { WsUploadStoreModel, WsUploadStoreContentItem } from './ws-upload-store-model';


export class WsAWSUploadStore extends WsGenericUploadStore implements IWsUploadStore, IDisposable {
  public subscribers: any[];
  private sts: AWS.STS;
  private bucket: AWS.S3;
  private uploadProcess: AWS.S3.ManagedUpload;
  private idToken: string;
  private awsSession: any;
  private cis: WsCisService;
  private timer: SimpleTimer;
  private timerId: string;
  private sessionExpiration: Date;
  private uuid: string;
  private readonly sessionThreshold = 300000;
  private stsCreds: AWS.STS.Credentials;
  private currentFile: File;
  private partSize: number;

  public uploadStartedSubject: Subject<boolean> = new Subject<boolean>();
  public uploadPausedSubject: Subject<boolean> = new Subject<boolean>();
  public uploadResumedSubject: Subject<boolean> = new Subject<boolean>();
  public uploadCanceledSubject: Subject<boolean> = new Subject<boolean>();
  public uploadCompletedSubject: Subject<FileUploader> = new Subject<FileUploader>();
  public uploadErrorSubject: Subject<any> = new Subject<any>();

  constructor(settings: WsAWSUploadStoreSettings, timer: SimpleTimer, cis: WsCisService) {
    super();
    this.subscribers = [];
    this.cis = cis;
    this.timer = timer;
    this.state = StoreState.Undefined;
    this.type = WsUploadStoreType.AWS;
    this.name = settings.name;
    this.url = settings.url;
    this.uploader = settings.uploader;
    this.roleArn = settings.roleArn;
    this.idToken = settings.idToken;
    this.region = settings.region;
  }

  dispose() {
    this.subscribers.forEach(element => {
      element.unsubscribe();
    });

    if (this.timerId) {
      this.timer.unsubscribe(this.timerId);
    }
  }

  public init(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.initAWS()
        .then(() => {
          this.timer.newTimer(this.uuid, 30);
          this.timerId = this.timer.subscribe(this.uuid, () => this.tick());
          resolve(true);
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  private initAWS(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.uuid = UUID.UUID();
      const params: AWS.STS.AssumeRoleWithWebIdentityRequest = {
        RoleArn: this.roleArn,
        RoleSessionName: this.uuid,
        WebIdentityToken: this.cis.user.id_token,
        // DurationSeconds: 900
        // DurationSeconds: 3600
        // DurationSeconds: 7200
        DurationSeconds: 43200
        // DurationSeconds: 86400
      };

      this.sts = new AWS.STS();

      this.sts.assumeRoleWithWebIdentity(params, (err, data) => {
        if (err) {
          this.state = StoreState.NotAccessible;
          reject(err);
          return;
        }

        this.state = StoreState.Accessible;
        this.stsCreds = data.Credentials;
        this.sessionExpiration = data.Credentials.Expiration;
        AWS.config.accessKeyId = data.Credentials.AccessKeyId;
        AWS.config.secretAccessKey = data.Credentials.SecretAccessKey;
        AWS.config.sessionToken = data.Credentials.SessionToken;

        this.readBucket();
        resolve(true);
      });
    });
  }

  private tick(): void {
    const now: Date = new Date(Date.now());
    const expiration = this.sessionExpiration.getTime() - now.getTime();

    if (expiration <= this.sessionThreshold) {
      console.log(`Renewing AWS STS session token`);
      this.initAWS()
        .then(() => {
          console.log(`Successfully renewed AWS STS session token`);
        })
        .catch(err => {
          console.log(`Renewing AWS STS session token failed`, err);
        });
    }
    const left = expiration - this.sessionThreshold;
    console.log(`Bucket ${this.name} Expiration check: ${(left / 1000 / 60).toFixed(0)} minutes left`);
  }

  private readBucket(): void {
    const slices = this.url.split('/');
    this.bucket = new AWS.S3({
      params: { Bucket: slices[0] }
    });
    this.hostName = slices[0];

    if (slices.length > 1) {
      if (slices[1].endsWith('/')) {
        this.folderName = slices[1];
      } else {
        this.folderName = `${slices[1]}/`;
      }
    }
  }

  public check(): Promise<any> {
    const request = this.bucket.headObject({
      Bucket: this.hostName,
      Key: this.folderName
    });

    return request.promise();
  }

  public upload(): void {
    this.initAWS()
      .then(() => {
        console.log(`Successfully renewed AWS STS session token. Starting Upload`);
        this.currentFile = this.uploader.queue[0]._file;
        const targetFileName = `${this.folderName}${this.uploader.queue[0]._file.name}`;
        this.partSize = 5 * 1024 * 1024;
        this.uploadProcess = new AWS.S3.ManagedUpload({
          leavePartsOnError: false,
          params: {
            Bucket: this.hostName,
            Key: targetFileName,
            Body: this.uploader.queue[0]._file,
            ACL: 'public-read'
          }
        });
        const test = AWS.S3.ManagedUpload.maxTotalParts;
        this.uploadProcess.on('httpUploadProgress', evt => {
          this.uploader.progress = (evt.loaded * 100) / evt.total;
        });
        this.uploadStartedSubject.next(true);
        this.uploadProcess.send( (err, data) => {
          this.send(err, data);
        });
      })
      .catch(err => {
        console.log(`Renewing AWS STS session token failed`, err);
        this.uploadErrorSubject.next(err);
      });
  }

  private send(err, data) {
    if (err) {
      console.log(`Upload error`, err);
      this.uploadErrorSubject.next(err);
      return;
    }

    this.uploadCompletedSubject.next(this.uploader);
  }

  public abort(): void {
    this.uploadProcess.abort();
    this.uploadCanceledSubject.next(true);
  }

  public async list(): Promise<WsUploadStoreModel> {
    const request = this.bucket.listObjectsV2({
      Bucket: this.hostName,
      Delimiter: '/',
      Prefix: this.folderName
    });

    const promise = await request.promise();
    const model = new WsUploadStoreModel();
    let contentItem: WsUploadStoreContentItem;

    for (let i = 1; i < promise.Contents.length; i++) {
      const item = promise.Contents[i];
      contentItem = new WsUploadStoreContentItem();
      contentItem.name = item.Key.replace(this.folderName, '');
      contentItem.size = item.Size;
      model.content.push(contentItem);
    }
    return model;
  }
}

export class WsAWSUploadStoreSettings {
  public name: string;
  public url: string;
  public region: string;
  public roleArn;
  public uploader: FileUploader;
  public idToken: string;
}
