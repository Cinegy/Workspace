import { Injectable } from '@angular/core';
import { WsBaseMamService } from '../shared/services/ws-base-mam/ws-base-mam.service';
import { NewBinParams } from '../ws-dialogs/ws-create-bin-dialog/new-bin-params';
import { Subject } from 'rxjs';

import { WsAppStateService } from '../ws-app-state.service';
import { HttpClient } from '@angular/common/http';
import { WsMamError } from '../shared/services/ws-base-mam/ws-mam-error';

@Injectable()
export class WsExplorerService  extends WsBaseMamService{
  private binParams: NewBinParams;

  public getRootSubject: Subject<any> = new Subject<any>();
  public getChildrenSubject: Subject<any> = new Subject<any>();
  public getNodeSubject: Subject<any> = new Subject<any>();
  public createNodeSubject: Subject<any> = new Subject<any>();
  private createDocumentBinInternalSubject: Subject<any> = new Subject<any>();
  public createDocumentBinSubject: Subject<any> = new Subject<any>();
  private createClipBinInternalSubject: Subject<any> = new Subject<any>();
  public createClipBinSubject: Subject<any> = new Subject<any>();
  public renameNodeSubject: Subject<any> = new Subject<any>();
  public deleteNodeSubject: Subject<any> = new Subject<any>();
  public copyNodeSubject: Subject<any> = new Subject<any>();
  public cutNodeSubject: Subject<any> = new Subject<any>();

  constructor( 
    protected httpClient:HttpClient,
    protected appState:WsAppStateService
  ) {
    super(httpClient,appState);
    this.createClipBinInternalSubject
    .subscribe(response => this.createBinResponse(response, this.createDocumentBinSubject));
    this.createClipBinInternalSubject
      .subscribe(response => this.createBinResponse(response, this.createClipBinSubject));
  }

  public getRoot() {
    // tslint:disable-next-line:max-line-length
    

    this.get(`${this.appState.selectedMam.mamEndpoint}node/root`, this.getRootSubject);
   

  }

  public getChildren(parentId: string) {

    // tslint:disable-next-line:max-line-length
    this.get(`${this.appState.selectedMam.mamEndpoint}node/list?parentId=${parentId}&filter.requestType=notDeleted&linksScope=self&linksScope=children&linksScope=metadata&take=10000&skip=0`, this.getChildrenSubject);

  
  }

  public getNode(id: string) {
    // tslint:disable-next-line:max-line-length
    this.get(`${this.appState.selectedMam.mamEndpoint}node?id=${id}&linksScope=children&linksScope=metadata`, this.getNodeSubject);
   
 
  }

  public createNode(parentId: string, nodeType: string, name: string) {
    this.put(
      `${this.appState.selectedMam.mamEndpoint}folder?parentId=${parentId}&type=${nodeType}`,
      { Name: name },
      this.createNodeSubject);
  }

  public createDocumentBin(parentId: string, params: NewBinParams) {
    this.binParams = params;
    this.put(
      `${this.appState.selectedMam.mamEndpoint}documentbin?parentId=${parentId}`,
      { Name: this.binParams.name },
      this.createDocumentBinInternalSubject);
  }

  public createClipBin(parentId: string, params: NewBinParams) {
    this.binParams = params;
    this.put(
      `${this.appState.selectedMam.mamEndpoint}clipbin?parentId=${parentId}`,
      { Name: this.binParams.name },
      this.createClipBinInternalSubject);
  }

  public renameNode(id: string, name: string) {
    this.post(
      `${this.appState.selectedMam.mamEndpoint}node?id=${id}`,
      { Name: name },
      this.renameNodeSubject);
  }

  public deleteNode(id: string) {
    this.delete(`${this.appState.selectedMam.mamEndpoint}node?id=${id}`, this.deleteNodeSubject);
  }

  public copyNode(id: string, parentId: string) {
    this.post(
      `${this.appState.selectedMam.mamEndpoint}node/copy?id=${id}&parentId=${parentId}&dataScope=fullInfo&linksScope=metadata`,
      null,
      this.copyNodeSubject);
  }

  public moveNode(cuttedNodeId: string, parentNodeId: string) {
    this.post(
      // tslint:disable-next-line:max-line-length
      `${this.appState.selectedMam.mamEndpoint}node/move?id=${cuttedNodeId}&parentId=${parentNodeId}&dataScope=fullInfo&linksScope=metadata`,
      null,
      this.cutNodeSubject);
  }

  private createBinResponse(response: any, subject: Subject<any>) {
    if (response instanceof WsMamError) {
      console.log(`Error: ${response.msg}`);
      subject.next(response);
      return;
    }

    subject.next(response);
    this.binParams.bin = response;
    this.post(
      `${this.appState.selectedMam.mamEndpoint}metadata?id=${this.binParams.bin.id}`,
      [{
        DescriptorId: this.binParams.descriptor.id,
        Value: this.binParams.mediaGroup.value
      }],
      null);
  }

}
