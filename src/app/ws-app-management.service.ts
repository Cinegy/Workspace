import { WsMamError } from './shared/services/ws-base-mam/ws-mam-error';
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
    this.getDescriptorsSubject
      .subscribe(response => this.getDescriptorsResponse(response));
    this.appState.selectNodeSubject
      .subscribe(response => this.selectedNodeResponse(response));

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

  private selectedNodeResponse(response: any) {
    if (response instanceof WsMamError) {
      return;
    }

    const descriptors = this.appState.descriptors[response.type];

    if (descriptors == null) {
      this.getDescriptors(response.type);
    }
  }

  private getDescriptorsResponse(response: any) {
    if (response instanceof WsMamError) {
      this.appState.descriptors[response.extMsg] = [];
      return;
    }

    console.log(`Getting descriptors for ${response.extra}`);
    this.appState.descriptors[response.extra] = response.payload;
  }
}
