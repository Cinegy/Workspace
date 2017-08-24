import { Subject } from 'rxjs/Subject';
import { WsAppStateService } from './ws-app-state.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { WsBaseMamService } from './shared/services/ws-base-mam/ws-base-mam.service';
import { Injectable } from '@angular/core';

@Injectable()
export class WsAppManagementService extends WsBaseMamService {
  public getNodeTypesSubject: Subject<any> = new Subject<any>();
  public getIconsSubject: Subject<any> = new Subject<any>();
  public getDescriptorsSubject: Subject<any> = new Subject<any>();

  constructor(
    protected httpClient: HttpClient,
    protected appState: WsAppStateService) {
    super(httpClient, appState);
  }

  public initialize() {
    this.token = this.appState.authHeader;
    this.headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Authorization', this.token);

      this.get(`${this.appState.selectedMam.mamEndpoint}management/icon/list?type=png&scope=large`, this.getIconsSubject);
      this.get(`${this.appState.selectedMam.mamEndpoint}management/nodetype/list`, this.getNodeTypesSubject);
  }

  public getDescriptors(type: any) {
    this.get(`${this.appState.selectedMam.mamEndpoint}descriptor/list?scope.type=${type}`, this.getDescriptorsSubject, type);
  }
}
