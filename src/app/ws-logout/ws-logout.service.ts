import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { WsAppStateService } from '../ws-app-state.service';
import { WsConfigurationService } from '../ws-configuration/ws-configuration.service';
import {WsBaseMamService} from "../shared/services/ws-base-mam/ws-base-mam.service";
import {HttpClient} from "@angular/common/http";
import {WsMamError} from "../shared/services/ws-base-mam/ws-mam-error";

@Injectable({
  providedIn: 'root'
})
export class WsLogoutService extends WsBaseMamService {

  public logoutSubject: Subject<any> = new Subject<any>();

  constructor(protected httpClient: HttpClient, protected appState: WsAppStateService) {
    super(httpClient, appState);
    this.logoutSubject.subscribe(response=>this.logoutResponse(response));
  }

  public logout() {
    this.post(`${this.appState.selectedMam.mamEndpoint}authentication/logout`, null, this.logoutSubject);
//    this.appState.setConnectionState(false, null);
//    this.logoutSubject.next(true);
  }

  private logoutResponse(response: any) {
    if (response instanceof WsMamError) {
      return;
    }
    this.appState.setConnectionState(false, null);
  }
}

