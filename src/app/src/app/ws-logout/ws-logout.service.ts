import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { WsAppStateService } from '../ws-app-state.service';
import { WsCisService } from '../shared/services/ws-cis/ws-cis.service';
import { WsConfigurationService } from '../ws-configuration/ws-configuration.service';

@Injectable({
  providedIn: 'root'
})
export class WsLogoutService {

  public logoutSubject: Subject<any> = new Subject<any>();

  constructor(private config: WsConfigurationService, private appState: WsAppStateService, private cisService: WsCisService) { }

  public logout() {
    this.appState.setConnectionState(false, null);

    if (this.config.configuration.cis.useCis) {
      this.cisService.logout();
    }

    this.logoutSubject.next(true);
  }
}

