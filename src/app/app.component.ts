import { WsMamError } from './shared/services/ws-base-mam/ws-mam-error';
import { Router } from '@angular/router';
import { WsLoginService } from './ws-login/ws-login.service';
import { WsAppStateService } from './ws-app-state.service';
import { WsAppManagementService } from './ws-app-management.service';
import { Observable } from 'rxjs/Observable';
import { WsConfigurationService } from './ws-configuration/ws-configuration.service';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  private subscribers: any[];

  constructor(
    private appState: WsAppStateService,
    private management: WsAppManagementService,
    private router: Router) {
    this.subscribers = [];
  }

  public ngOnInit() {
    console.log('*** Application started ***');

    const subscriber = this.appState.loggedInSubject
      .subscribe(response => this.loginResponse(response));
    this.subscribers.push(subscriber);
  }

  ngOnDestroy() {
    this.subscribers.forEach(element => {
      element.unsubscribe();
    });
  }

  private loginResponse(response: any) {
    this.management.initialize();
    this.router.navigate(['/main']);
  }
}
