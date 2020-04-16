import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { WsAppStateService } from '../ws-app-state.service';
import { WsConfigurationService } from '../ws-configuration/ws-configuration.service';

@Injectable({
  providedIn: 'root'
})
export class WsLogoutService {

  public logoutSubject: Subject<any> = new Subject<any>();

  constructor(private config: WsConfigurationService, private appState: WsAppStateService) { }

  public logout() {
    this.appState.setConnectionState(false, null);
    this.logoutSubject.next(true);
  }
}

