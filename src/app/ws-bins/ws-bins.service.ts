import { Injectable } from '@angular/core';
import { WsBaseMamService } from '../shared/services/ws-base-mam/ws-base-mam.service';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { WsAppStateService } from '../ws-app-state.service';

@Injectable({
  providedIn: 'root'
})
export class WsBinsService extends WsBaseMamService {
  private clipboardItem: any;
  public getChildrenSubject: Subject<any> = new Subject<any>();
  public getRollSubject: Subject<any> = new Subject<any>();
  public getClipBinSubject: Subject<any> = new Subject<any>();
  public getDocumentBinSubject: Subject<any> = new Subject<any>();
  public startSearchSubject: Subject<any> = new Subject<any>();
  public searchSubject: Subject<any> = new Subject<any>();
  public deleteNodeSubject: Subject<any> = new Subject<any>();
  public linkMasterclipSubject: Subject<any> = new Subject<any>();
  public copyNodeSubject: Subject<any> = new Subject<any>();
  // public internalCutClipSubject: Subject<any> = new Subject<any>();
  public cutNodeSubject: Subject<any> = new Subject<any>();
  public getMetadataSubject: Subject<any> = new Subject<any>();

  constructor(
    protected httpClient: HttpClient,
    protected appState: WsAppStateService) {
    super(httpClient, appState);

    // this.internalCutClipSubject
    //   .subscribe(response => this.internalCutClipResponse(response));
  }

  public getBin(id: string, type: string) {
    let fragment: string;
    let subject: Subject<any>;

    switch (type) {
      case 'roll':
        fragment = `roll?id=${id}&masterClipScope=videoFormat&linksScope=children&linksScope=metadata`;
        subject = this.getRollSubject;
        break;
      case 'clipBin':
        fragment = `clipbin?id=${id}&clipScope=videoFormat&linksScope=children&linksScope=metadata`;
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
        fragment = `clipbin/list?parentId=${id}&clipScope=videoFormat&clipScope=offsets&clipScope=fileSet&clipScope=thumbnail&clipScope=general&requestType=notDeleted`;
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
    this.post(`${this.appState.selectedMam.mamEndpoint}masterclip/link?masterclipId=${masterclipId}&clipBinId=${clipBinId}&clipScope=videoFormat&clipScope=offsets&clipScope=fileset&clipScope=general&clipScope=thumbnail`, null, this.linkMasterclipSubject);
  }

  public copyNode(clipId: string, clipBinId: string) {
    // tslint:disable-next-line:max-line-length
    this.post(`${this.appState.selectedMam.mamEndpoint}node/copy?id=${clipId}&parentId=${clipBinId}&dataScope=fullInfo&linksScope=metadata`, null, this.copyNodeSubject);
  }

  public moveNode(cuttedNodeId: string, parentNodeId: string) {
    // this.clipboardItem = clipboardItem;
    // tslint:disable-next-line:max-line-length
    // this.post(`${this.appState.selectedMam.mamEndpoint}node/copy?id=${clipboardItem.id}&parentId=${clipBinId}`, null, this.internalCutClipSubject);

    this.post(
      // tslint:disable-next-line:max-line-length
      `${this.appState.selectedMam.mamEndpoint}node/move?id=${cuttedNodeId}&parentId=${parentNodeId}&dataScope=fullInfo&linksScope=metadata`,
      null,
      this.cutNodeSubject);
  }
  // public getMetadata(node: any) {
  
  //   this.get(`${this.appState.selectedMam.mamEndpoint}metadata?id=${node.id}`, this.getMetadataSubject);
  // }
}
