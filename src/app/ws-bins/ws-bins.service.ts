import { ClipboardItem } from './clipboard-item';
import { WsMamError } from './../shared/services/ws-base-mam/ws-mam-error';
import { WsAppStateService } from './../ws-app-state.service';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs/Subject';
import { Injectable } from '@angular/core';
import { WsBaseMamService } from '../shared/services/ws-base-mam/ws-base-mam.service';

@Injectable()
export class WsBinsService extends WsBaseMamService {
  private clipboardItem: ClipboardItem;
  public getChildrenSubject: Subject<any> = new Subject<any>();
  public getRollSubject: Subject<any> = new Subject<any>();
  public getClipBinSubject: Subject<any> = new Subject<any>();
  public getDocumentBinSubject: Subject<any> = new Subject<any>();
  public startSearchSubject: Subject<any> = new Subject<any>();
  public searchSubject: Subject<any> = new Subject<any>();
  public deleteNodeSubject: Subject<any> = new Subject<any>();
  public linkMasterclipSubject: Subject<any> = new Subject<any>();
  public copyClipSubject: Subject<any> = new Subject<any>();
  public internalCutClipSubject: Subject<any> = new Subject<any>();
  public cutClipSubject: Subject<any> = new Subject<any>();

  constructor(
    protected httpClient: HttpClient,
    protected appState: WsAppStateService) {
    super(httpClient, appState);

    this.internalCutClipSubject
      .subscribe(response => this.internalCutClipResponse(response));
  }

  public getBin(id: string, type: string) {
    let fragment: string;
    let subject: Subject<any>;

    switch (type) {
      case 'roll':
        fragment = `roll?id=${id}&rollScope=videoFormat&linksScope=children&linksScope=metadata`;
        subject = this.getRollSubject;
        break;
      case 'clipBin':
        fragment = `clipbin?id=${id}&clipBinScope=videoFormat&linksScope=children&linksScope=metadata`;
        subject = this.getClipBinSubject;
        break;
      case 'documentBin':
        fragment = `node?id=${id}&linksScope=children&linksScope=metadata`;
        subject = this.getDocumentBinSubject;
        break;
    }

    this.get(`${this.appState.selectedMam.mamEndpoint}${fragment}`, subject);
  }

  public getChildren(id: string, type: string, take?: number, skip?: number) {
    if (take === undefined) {
      take = this.appState.itemsPerPage;
    }

    if (skip === undefined) {
      skip = 0;
    }

    let fragment: string;

    switch (type) {
      case 'roll':
        // tslint:disable-next-line:max-line-length
        fragment = `roll/list?parentId=${id}&masterClipScope=videoFormat&masterClipScope=offsets&masterClipScope=fileSet&masterClipScope=thumbnail`;
        break;
      case 'clipBin':
        // tslint:disable-next-line:max-line-length
        fragment = `clipbin/list?parentId=${id}&clipScope=videoFormat&clipScope=offsets&clipScope=fileSet&clipScope=thumbnail&clipScope=general`;
        break;
      case 'documentBin':
        fragment = `documentbin/list?parentId=${id}&documentScope=full`;
        break;
      default:
        fragment = `node/list?parentId=${id}`;
        break;
    }

    // tslint:disable-next-line:max-line-length
    this.get(`${this.appState.selectedMam.mamEndpoint}${fragment}&linksScope=metadata&filter.requestType=notDeleted&take=${take}&skip=${skip}`, this.getChildrenSubject);
  }

  public search(keywords: string, take?: number, skip?: number) {
    this.startSearchSubject.next(keywords);

    if (take === undefined) {
      take = this.appState.itemsPerPage;
    }

    if (skip === undefined) {
      skip = 0;
    }

    // tslint:disable-next-line:max-line-length
    this.post(`${this.appState.selectedMam.mamEndpoint}search?linkScope=self&linkScope=self&linkScope=children&linksScope=metadata&searchScope=fullInfo&take=${take}&skip=${skip}`,
      { Query: keywords },
      this.searchSubject);
  }

  public deleteNode(id: string) {
    this.delete(`${this.appState.selectedMam.mamEndpoint}node?id=${id}`, this.deleteNodeSubject);
  }

  public linkMasterclip(masterclipId: string, clipBinId: string) {
    // tslint:disable-next-line:max-line-length
    this.post(`${this.appState.selectedMam.mamEndpoint}masterclip/link?masterclipId=${masterclipId}&clipBin=${clipBinId}`, null, this.linkMasterclipSubject);
  }

  public copyClip(clipId: string, clipBinId: string) {
    // tslint:disable-next-line:max-line-length
    this.post(`${this.appState.selectedMam.mamEndpoint}node/copy?id=${clipId}&parentId=${clipBinId}`, null, this.copyClipSubject);
  }

  public cutClip(clipboardItem: ClipboardItem, clipBinId: string) {
    this.clipboardItem = clipboardItem;
    // tslint:disable-next-line:max-line-length
    this.post(`${this.appState.selectedMam.mamEndpoint}node/copy?id=${clipboardItem.item.id}&parentId=${clipBinId}`, null, this.internalCutClipSubject);
  }

  private internalCutClipResponse(response) {
    if (response instanceof WsMamError) {
      return;
    }

    this.copyClipSubject.next(response);
    this.delete(`${this.appState.selectedMam.mamEndpoint}node?id=${this.clipboardItem.item.id}`, this.cutClipSubject);
  }
}
