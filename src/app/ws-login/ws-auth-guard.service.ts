import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { WsAppStateService } from '../ws-app-state.service';
import { WsConfigurationService } from '../ws-configuration/ws-configuration.service';

@Injectable({
  providedIn: 'root'
})
export class WsAuthGuardService implements CanActivate {

  constructor(
    private router: Router,
    private appState: WsAppStateService,
    private config: WsConfigurationService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

      if (this.appState.connected) {
        return true;
      }

      this.router.navigate(['/login']);
      return false;
  }

}

