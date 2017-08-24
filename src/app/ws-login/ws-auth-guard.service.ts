import { WsAppStateService } from './../ws-app-state.service';
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable()
export class WsAuthGuardService implements CanActivate {

  constructor(
    private router: Router,
    private appState: WsAppStateService) { }

  canActivate() {

    if (this.appState.connected) {
      console.log('Authentication was successfull.');
      return true;
    } else {
      console.log('Authentication failed. Redirecting to login page');
      this.router.navigate(['/login']);
      return false;
    }

  }

}
