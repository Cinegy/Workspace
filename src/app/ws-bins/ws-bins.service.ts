import { WsAppStateService } from './../ws-app-state.service';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs/Subject';
import { Injectable } from '@angular/core';
import { WsBaseMamService } from '../shared/services/ws-base-mam/ws-base-mam.service';

@Injectable()
export class WsBinsService extends WsBaseMamService {
  public getChildrenSubject: Subject<any> = new Subject<any>();
  public getRollSubject: Subject<any> = new Subject<any>();
  public getClipBinSubject: Subject<any> = new Subject<any>();

  constructor(
    protected httpClient: HttpClient,
    protected appState: WsAppStateService) {
    super(httpClient, appState);
  }

  public getRoll(id: string) {
    this.get(`${this.appState.selectedMam.mamEndpoint}roll?id=${id}&rollScope=videoFormat&linksScope=self`, this.getRollSubject);
  }

  public getClipBin(id: string) {
    this.get(`${this.appState.selectedMam.mamEndpoint}clipbin?id=${id}&clipBinScope=videoFormat&linksScope=self`, this.getClipBinSubject);
  }

  public getChildren(id: string) {
    // tslint:disable-next-line:max-line-length
    this.get(`${this.appState.selectedMam.mamEndpoint}node/list?parentId=${id}&linkScope=self&filter.requestType=notDeleted`, this.getChildrenSubject);
  }

}
