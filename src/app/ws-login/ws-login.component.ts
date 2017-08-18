import { Router } from '@angular/router';
import { WsAppStateService } from './../ws-app-state.service';
import { WsMamError } from './../shared/services/ws-base-mam/ws-mam-error';
import { WsLoginService } from './ws-login.service';
import { WsMamConnection } from './../shared/services/ws-base-mam/ws-mam-connection';
import { WsConfigurationService } from './../ws-configuration/ws-configuration.service';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-ws-login',
  templateUrl: './ws-login.component.html',
  styleUrls: ['./ws-login.component.css']
})
export class WsLoginComponent implements OnInit, OnDestroy {
  public subscribers: any[];
  public mamList: WsMamConnection[];
  public selectedMam: WsMamConnection;
  public isConnectionSpinnerHidden = true;
  public errorMsg = [];

  public username = 'User1';
  public password = 'aaiisstt!123';
  public domain = 'MOON';

  constructor(
    private appState: WsAppStateService,
    private configService: WsConfigurationService,
    private loginService: WsLoginService,
    private router: Router) {
    this.subscribers = [];

    this.configService.getConfig()
      .subscribe(mamList => {
        this.mamList = mamList;

        if (this.mamList && this.mamList.length > 0) {
          this.selectedMam = this.mamList[0];
        }
      });
  }

  ngOnInit() {
    this.subscribeLogin();
  }

  ngOnDestroy() {
    this.subscribers.forEach(element => {
      element.unsubscribe();
    });
  }

  public onSubmit() {
    this.errorMsg = [];
    this.appState.connected = false;
    this.isConnectionSpinnerHidden = false;
    this.selectedMam.username = this.username;
    this.selectedMam.password = this.password;
    this.selectedMam.domain = this.domain;
    this.loginService.login(this.selectedMam);
  }

  private subscribeLogin() {
    const subscriber = this.loginService.loginSubject
      .subscribe(
      (result) => {
        this.isConnectionSpinnerHidden = true;

        if (result instanceof WsMamError) {
          const error: WsMamError = result;
          this.appState.connected = false;
          console.log(`Error: ${error.msg}`);
          this.errorMsg.push({ severity: 'error', detail: error.msg });
        } else {
          this.appState.connected = true;
          this.appState.selectedMam = this.selectedMam;
          this.appState.setAuthHeader(result.access_token, result.token_type, result.expires_in);
          console.log(`${this.selectedMam.username} logged in`);
          this.router.navigate(['/main', { outlets: { 'routeLeftContainer': ['explorer'] } }]);
        }
      });
      this.subscribers.push(subscriber);
  }

}
