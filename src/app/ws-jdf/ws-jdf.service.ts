import { Subject } from 'rxjs/Subject';
import { WsBaseMamService } from './../shared/services/ws-base-mam/ws-base-mam.service';
import { WsAppStateService } from './../ws-app-state.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class WsJdfService extends WsBaseMamService {
  public getJdfSubject: Subject<any> = new Subject<any>();

  constructor(
    protected httpClient: HttpClient,
    protected appState: WsAppStateService) {
    super(httpClient, appState);
  }

  public getJdf(node: any): void {
    // tslint:disable-next-line:max-line-length
    this.get(`${this.appState.selectedMam.mamEndpoint}jobdroptarget/list?parentId=${node.id}&requestType=notDeleted&linksScope=self&take=100&skip=0`, this.getJdfSubject);
  }

}
