import { Injectable } from '@angular/core';
import { WsBaseMamService } from '../shared/services/ws-base-mam/ws-base-mam.service';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { WsAppStateService } from '../ws-app-state.service';

@Injectable({
  providedIn: 'root'
})
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
