import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { WsCisService } from '../shared/services/ws-cis/ws-cis.service';
import { WsAppStateService } from '../ws-app-state.service';
import { WsConfigurationService } from '../ws-configuration/ws-configuration.service';

@Injectable({
  providedIn: 'root'
})
export class WsAuthGuardService implements CanActivate {

  constructor(
    private router: Router,
    private cis: WsCisService,
    private appState: WsAppStateService,
    private config: WsConfigurationService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

    if (!this.config.configuration.cis.useCis) {
      if (this.appState.connected) {
        return true;
      }

      this.router.navigate(['/login']);
      return false;
    }

    if (this.cis.isLoggedIn() && this.appState.connected) {
      return true;
    }

    this.cis.startAuthentication();
    return false;
  }

}

