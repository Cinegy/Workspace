import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { WsAuthRequest } from './ws-auth-request';
import { WsMamConnection } from '../shared/services/ws-base-mam/ws-mam-connection';
import { WsMamError } from '../shared/services/ws-base-mam/ws-mam-error';
import { WsAppStateService } from '../ws-app-state.service';

@Injectable({
  providedIn: 'root'
})
export class WsLoginService {
  private connectionInfo:WsMamConnection;
  public loginSubject:Subject<any>=new Subject<any>();
  public reconnectSubject:Subject<any>=new Subject<any>();

  constructor(
    protected httpClient:HttpClient,
    protected appState:WsAppStateService
    ) { }
  
  public login(connectionInfo: WsMamConnection, reconnect: boolean){
    this.connectionInfo=connectionInfo;
  
    const authRequest=new WsAuthRequest();
    authRequest.casEndpoint = connectionInfo.casEndpoint;
    authRequest.database = connectionInfo.dbName;
    authRequest.server = connectionInfo.dbServer;
    authRequest.product = 'CinegyWorkspace';
    authRequest.productLicense = '{6eecc5d8-df37-4ead-b79c-25874fd616a2}';
    authRequest.productVersion = '1.0';

    const authHeader = btoa(`${this.connectionInfo.domain}/${this.connectionInfo.username}:${this.connectionInfo.password}`);
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Authorization', `Basic ${authHeader}`);

    this.httpClient
      .post(`${this.connectionInfo.mamEndpoint}/authentication`, authRequest, { headers: headers })
      .subscribe(
      data => {
        if (reconnect) {
          this.reconnectSubject.next(data);
          return;
        }
        this.loginSubject.next(data);
      },
      (err: HttpErrorResponse) => {
        if (reconnect) {
          this.reconnectSubject.next(err);
          return;
        }
        this.handleError(err, this.loginSubject);
      }
      );
  }

  private handleError(err: HttpErrorResponse, subject: Subject<any>, extraSubjectData?: any) {
    const mamError = new WsMamError();

    if (!err.error || !err.error.error) {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      mamError.msg = `Backend returned code ${err.status}, message was: ${err.message}`;
      mamError.status = err.status;
      console.log(mamError.msg);
    } else if (err.error instanceof Error) {
      // A client-side or network error occurred. Handle it accordingly.
      mamError.msg = err.error.message;
      console.log('An error occurred:', mamError.msg);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      mamError.msg = `Backend returned code ${err.status}, message was: ${err.error.error}`;
      mamError.status = err.status;
      console.log(mamError.msg);
    }

    if (extraSubjectData) {
      mamError.extMsg = extraSubjectData;
    }

    if (subject) {
      subject.next(mamError);
    }
  }

}
