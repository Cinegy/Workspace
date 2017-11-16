import { NewBinParams } from './../ws-dialogs/ws-create-bin-dialog/new-bin-params';
import { WsMamError } from './../shared/services/ws-base-mam/ws-mam-error';
import { Observable } from 'rxjs/RX';
import { Subject } from 'rxjs/Subject';
import { WsAppStateService } from './../ws-app-state.service';
import { HttpClient } from '@angular/common/http';
import { WsBaseMamService } from './../shared/services/ws-base-mam/ws-base-mam.service';
import { Injectable } from '@angular/core';

@Injectable()
export class WsExplorerService extends WsBaseMamService {
  private binParams: NewBinParams;
  private cutedNode: any;
  private cutedNodeId: string;

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
  private copyNodeInternalSubject: Subject<any> = new Subject<any>();
  private deleteNodeInternalSubject: Subject<any> = new Subject<any>();

  constructor(
    protected httpClient: HttpClient,
    protected appState: WsAppStateService) {
    super(httpClient, appState);

    this.createDocumentBinInternalSubject
      .subscribe(response => this.createBinResponse(response, this.createDocumentBinSubject));
    this.createClipBinInternalSubject
      .subscribe(response => this.createBinResponse(response, this.createClipBinSubject));
    this.copyNodeInternalSubject
      .subscribe(response => this.copyNodeResponse(response));
    this.deleteNodeInternalSubject
      .subscribe(response => this.deletNodeResponse(response));
  }

  public getRoot() {
    // tslint:disable-next-line:max-line-length
    this.get(`${this.appState.selectedMam.mamEndpoint}node/root`, this.getRootSubject);
  }

  public getChildren(url: string) {
    // tslint:disable-next-line:max-line-length
    this.get(`${url}&linksScope=self&filter.requestType=notDeleted&linksScope=children&linksScope=metadata`, this.getChildrenSubject);
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
      `${this.appState.selectedMam.mamEndpoint}node/copy?id=${id}&parentId=${parentId}`,
      null,
      this.copyNodeSubject);
  }

  public cutNode(id: string, parentId: string) {
    this.cutedNodeId = id;
    this.post(
      `${this.appState.selectedMam.mamEndpoint}node/copy?id=${id}&parentId=${parentId}`,
      null,
      this.copyNodeInternalSubject);
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

  private copyNodeResponse(response) {
    if (response instanceof WsMamError) {
      console.log(`Error: ${response.msg}`);
      this.cutNodeSubject.next(response);
      return;
    }

    this.cutedNode = response;
    this.delete(`${this.appState.selectedMam.mamEndpoint}node?id=${this.cutedNodeId}`, this.deleteNodeInternalSubject);
  }

  private deletNodeResponse(response) {
    if (response instanceof WsMamError) {
      console.log(`Error: ${response.msg}`);
      this.cutNodeSubject.next(response);
      return;
    }

    this.cutNodeSubject.next(this.cutedNode);
  }
}
