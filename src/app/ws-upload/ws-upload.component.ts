import { Component, OnInit, OnDestroy } from '@angular/core';
import { WsErrorDialogComponent } from '../ws-dialogs/ws-error-dialog/ws-error-dialog.component';
import { UploadModel } from './upload-model';
import { FileUploader } from 'ng2-file-upload';
import { WsUploadStoreType, IWsUploadStore } from '../shared/services/ws-base-mam/ws-upload-store';
import { SimpleTimer } from 'ng2-simple-timer';
import { MatDialog, MatSnackBar } from '@angular/material';
import { WsCisService } from '../shared/services/ws-cis/ws-cis.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { WsAppStateService } from '../ws-app-state.service';
import { WsUploadStoreModel } from '../shared/services/ws-base-mam/ws-upload-store-model';
import { WsAWSUploadStoreSettings, WsAWSUploadStore } from '../shared/services/ws-base-mam/ws-aws-upload-store';
import { WsSimpleUploadStore } from '../shared/services/ws-base-mam/ws-simple-upload-store';
import { HttpHeader } from 'aws-sdk/clients/cognitoidentityserviceprovider';

@Component({
  selector: 'app-ws-upload',
  templateUrl: './ws-upload.component.html',
  styleUrls: ['./ws-upload.component.css']
})
export class WsUploadComponent implements  OnInit, OnDestroy {
  private subscribers: any[];
  public uploadModels: UploadModel[];
  public selectedModel: UploadModel;
  public selectedStoreContent: WsUploadStoreModel;
  public loading = false;
  public uploadPaused = false;
  
  

  constructor(
    private appState: WsAppStateService,
    public snackBar: MatSnackBar,
    private http: HttpClient,
    private cis: WsCisService,
    public dialog: MatDialog,
    private timer: SimpleTimer) {
    this.uploadModels = [];
    this.subscribers = [];
    
  }

  ngOnInit() {

    const stores = this.appState.selectedMam.uploadStores;
    console.log(stores);

    // if (!this.appState.selectedMam.cis.useCis) {
    //   return;
    // }
    

    stores.forEach(async item => {
      let store: IWsUploadStore;

      const uploadModel = new UploadModel();
      uploadModel.name = item.name;
      uploadModel.uploader = new FileUploader({ removeAfterUpload: true });

      switch (item.type) {
        case WsUploadStoreType.Simple:
          store = new WsSimpleUploadStore(item.name, item.url, uploadModel.uploader, this.http);
          store.init()
            .then(data=> {
              uploadModel.store = store;

              const subscriber = store.uploadCompletedSubject
              .subscribe(response => this.onUploadCompletedSubject(response));
              this.subscribers.push(subscriber);

              store.check()
                .then(
                  resolve => {
                    this.uploadModels.push(uploadModel);
                  },
                  reject => {
                    this.openErrorDialog(`Error reading simple store: ${store.name}: ${reject.message}`);
                  });
            }).catch(err => {
              this.openErrorDialog(`Error getting simple store: ${store.name}: ${err.message}`);
            })
          console.log("Simple store here");
          break;
        case WsUploadStoreType.AWS:
          const settings: WsAWSUploadStoreSettings = {
            idToken: this.cis.user.id_token,
            name: item.name,
            region: item.region,
            roleArn: item.roleArn,
            uploader: uploadModel.uploader,
            url: item.url
          };
          store = new WsAWSUploadStore(settings, this.timer, this.cis);
          store.init()
            .then(data => {
              uploadModel.store = store;

              const subscriber = store.uploadCompletedSubject
                .subscribe(response => this.onUploadCompletedSubject(response));
              this.subscribers.push(subscriber);

              store.check()
                .then(
                  resolve => {
                    this.uploadModels.push(uploadModel);
                  },
                  reject => {
                    this.openErrorDialog(`Error reading Bucket ${store.name}: ${reject.message}`);
                  });
            })
            .catch(err => {
              this.openErrorDialog(`Error reading Bucket ${store.name}: ${err.message}`);
            });
          break;
      }


    });
  }

  ngOnDestroy(): void {
    this.subscribers.forEach(element => {
      element.unsubscribe();
    });

    this.uploadModels.forEach(item => {
      item.store.dispose();
    });
  }

  /* *** Upload *** */
  public uploadFile(e: any, model: UploadModel): void {
    this.uploadPaused = false;
    model.file = model.uploader.queue[0]._file;
    model.store.upload();
  }

  public cancelUpload(model: UploadModel): void {
    try {
      if (model.file == null) {
        return;
      }

      model.store.abort();
      this.snackBar.open(`${model.file.name} upload canceled`, null, { duration: 3000 });
      model.file = null;
      model.uploader.clearQueue();
    } catch (e) {
      console.log(e);
    }
  }

  public onUploadCompletedSubject(result: FileUploader) {
    this.snackBar.open(`${result.queue[0].file.name} upload completed`, null, { duration: 3000 });
    result.clearQueue();
  }

  public storeSelected(e: any, model: UploadModel): void {
    this.selectedModel = model;
    this.loading = true;
    model.store.list().then(
      data => {
        this.loading = false;
        this.selectedStoreContent = data;
      },
      error => {
        this.loading = false;
        this.snackBar.open(error, null, { duration: 3000 });
      }
    );
  }

  private openErrorDialog(msg: string) {
    const dialogRef = this.dialog.open(WsErrorDialogComponent, {
      // width: '300px',
      data: msg
    });
  }

  public normalizeFileSize(fileSize: number): string {
    const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    let size = fileSize;
    let unit = 0;

    while (size >= 1024) {
      size /= 1024;
      ++unit;
    }

    return `${size.toFixed(2)} ${units[unit]}`;
  }
}
