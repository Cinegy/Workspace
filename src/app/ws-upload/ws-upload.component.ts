import { WsUploadStore } from './../shared/services/ws-base-mam/ws-upload-store';
import { WsAppStateService } from './../ws-app-state.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FileUploader, FileSelectDirective, FileDropDirective, FileItem } from 'ng2-file-upload';
import { UploadModel } from './upload-model';
import * as AWS from 'aws-sdk';
import { MatSnackBar } from '@angular/material';


@Component({
  selector: 'app-ws-upload',
  templateUrl: './ws-upload.component.html',
  styleUrls: ['./ws-upload.component.css']
})
export class WsUploadComponent implements OnInit, OnDestroy {
  private subscribers: any[];
  public uploadModels: UploadModel[];
  public selectedModel: UploadModel;
  public selectedStoreContent = [];
  public loading = false;

  constructor(private appState: WsAppStateService, public snackBar: MatSnackBar) {
    this.subscribers = [];
    this.uploadModels = [];

    AWS.config.update({
      region: 'eu-central-1',
      accessKeyId: 'AKIAIIKJILWAB37G3DOA',
      secretAccessKey: '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'
    });
  }

  ngOnInit() {
    const stores = this.appState.selectedMam.uploadStores;
    stores.forEach(item => {
      const slices = item.url.split('/');
      item.bucket = new AWS.S3({
        params: { Bucket: slices[0] }
      });
      item.bucketName = slices[0];

      if (slices.length > 1) {
        if (slices[1].endsWith('/')) {
          item.bucketFolder = slices[1];
        } else {
          item.bucketFolder = `${slices[1]}/`;
        }
      }

      const uploader = new FileUploader({url: item.url, removeAfterUpload:  true});
      uploader.onCompleteAll = () => {
        uploader.clearQueue();
      };
      const uploadModel = new UploadModel();
      uploadModel.name = item.name;
      uploadModel.store = item;
      this.bucketCheck(uploadModel);
    });
  }

  ngOnDestroy(): void {
    this.subscribers.forEach(element => {
      element.unsubscribe();
    });
  }

  /* *** S3 *** */
  private bucketCheck(model: UploadModel) {
    model.store.bucket.headObject({
      Bucket: model.store.bucketName,
      Key: model.store.bucketFolder
    }, (err, data) => {
      if (err) {
        console.log('Error', err);
        // model.store.bucket.putObject({
        //   Bucket: model.store.bucketName,
        //   Key: model.store.bucketFolder
        // }, (errCreate, dataCreate) => {
        //   if (err) {
        //     console.log('Error', errCreate);
        //   } else {
        //     console.log('Success', dataCreate);
        //   }
        // });

      } else {
        this.uploadModels.push(model);
      }
    });
  }

  private bucketList(model: UploadModel) {
    this.loading = true;
    model.store.bucket.listObjectsV2({
      Bucket: model.store.bucketName,
      Delimiter: '/',
      Prefix: model.store.bucketFolder
    }, (err, data) => {
      this.loading = false;
      if (err) {
        console.log('Error', err);
      } else {
        console.log('Success', data);
        // this.selectedStoreContent = data.Contents;
        this.selectedStoreContent = [];

        for (let i = 1; i < data.Contents.length; i++) {
          const item = data.Contents[i];
          item.Name = item.Key.replace(model.store.bucketFolder, '');
          this.selectedStoreContent.push(item);
        }
      }
    });
  }

  public bucketAddObject(model: UploadModel, file: File) {
    console.log(`Uploading ${file.name}`);
    const targetFileName = `${model.store.bucketFolder}${file.name}`;
    model.upload = model.store.bucket.upload(
      {
        Bucket: model.store.bucketName,
        Key: targetFileName,
        Body: file,
        ACL: 'public-read'
      }, (err, data) => {
        if (err) {
          console.log('Error', err);
        } else {
          console.log('Success', data);
        }
      }
    );

    model.upload.on('httpUploadProgress', evt => {
      model.uploadProgress = (evt.loaded * 100) / evt.total;
    })
    .send((err, data) => {
      model.uploadProgress = 0;
      if (err) {
        this.snackBar.open(`${file.name} upload canceled. ${err}`, null, { duration: 3000 });
      } else {
        console.log('Success', data);
        this.snackBar.open(`${file.name} uploaded successfully`, null, { duration: 3000 });
        if (this.selectedModel === model) {
          this.storeSelected(null, model);
        }

      }
    });
  }

  /* *** Upload *** */
  public fileSelected(e: any, model: UploadModel): void {
    // uploadModel.uploader.uploadAll();

    // model.uploader.queue.forEach(item => {
    //   // item.url = model.store.url;
    //   // item.withCredentials = false;
    //   this.bucketAddObject(model, item);

    // });
    // model.uploader.clearQueue();
    // // model.uploader.uploadAll();
    if (e == null || e.srcElement.files.length === 0) {
      return;
    }
    this.bucketAddObject(model, e.srcElement.files[0]);
  }

  public cancelUpload(model: UploadModel): void {
    if (model.upload == null) {
      return;
    }

    model.upload.abort();
      // .abortMultipartUpload( (err, data) => {
    //   if (err) {
    //     console.log('Error', err);
    //     this.snackBar.open(`Upload cancellation error`, null, { duration: 2000 });
    //   } else {
    //     console.log('Success', data);
    //     this.snackBar.open(`Upload canceled`, null, { duration: 2000 });
    //   }
    // });
  }


  public storeSelected(e: any, model: UploadModel): void {
    this.selectedModel = model;
    this.bucketList(model);
  }

  /* *** File List *** */
}
