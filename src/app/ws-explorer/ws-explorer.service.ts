import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { WsAppStateService } from './../ws-app-state.service';
import { HttpClient } from '@angular/common/http';
import { WsBaseMamService } from './../shared/services/ws-base-mam/ws-base-mam.service';
import { Injectable } from '@angular/core';

@Injectable()
export class WsExplorerService extends WsBaseMamService {
  public getRootSubject: Subject<any> = new Subject<any>();
  public getChildrenSubject: Subject<any> = new Subject<any>();
  public getNodeSubject: Subject<any> = new Subject<any>();

  constructor(
    protected httpClient: HttpClient,
    protected appState: WsAppStateService) {
    super(httpClient, appState);
  }

  public getRoot() {
    this.get(`${this.appState.selectedMam.mamEndpoint}/node/root`, this.getRootSubject);
  }

  public getChildren(url: string) {
    this.get(`${url}&linksScope=self&filter.requestType=notDeleted`, this.getChildrenSubject);
  }

  public getNode(id: string) {
    this.get(`${this.appState.selectedMam.mamEndpoint}/node?id=${id}&linksScope=children`, this.getNodeSubject);
  }
}
