import { WsAppStateService } from './../ws-app-state.service';
import { WsAuthRequest } from './ws-auth-request';
import { Subject } from 'rxjs/Subject';
import { WsMamConnection } from './../shared/services/ws-base-mam/ws-mam-connection';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { WsBaseMamService } from './../shared/services/ws-base-mam/ws-base-mam.service';
import { Injectable } from '@angular/core';

@Injectable()
export class WsLoginService extends WsBaseMamService {
  private connectionInfo: WsMamConnection;
  public loginSubject: Subject<any> = new Subject<any>();

  constructor(
    protected httpClient: HttpClient,
    protected appState: WsAppStateService) {
    super(httpClient, appState);
  }

  public login(connectionInfo: WsMamConnection) {
    this.connectionInfo = connectionInfo;

    const authRequest = new WsAuthRequest();
    authRequest.casEndpoint = connectionInfo.casEndpoint;
    authRequest.database = connectionInfo.dbName;
    authRequest.server = connectionInfo.dbServer;
    authRequest.product = 'CinegyWorkspace';
    authRequest.productLicense = '{705EADF7-EAAD-4f7c-8141-862C2C511A61}';
    authRequest.productVersion = '1.0';

    const authHeader = btoa(`${this.connectionInfo.domain}/${this.connectionInfo.username}:${this.connectionInfo.password}`);
    this.headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Authorization', `Basic ${authHeader}`);

    this.post(`${this.connectionInfo.mamEndpoint}/authentication`, authRequest, this.loginSubject);
  }

  public logout() {
    this.appState.connected = false;
    console.log(`${this.connectionInfo.username} logged out`);
  }

}
