import { WsAppStateService } from './../ws-app-state.service';
import { WsMamError } from './../shared/services/ws-base-mam/ws-mam-error';
import { WsLoginService } from './ws-login.service';
import { WsMamConnection } from './../shared/services/ws-base-mam/ws-mam-connection';
import { WsConfigurationService } from './../ws-configuration/ws-configuration.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { WsConfiguration } from '../ws-configuration/ws-configuration';

@Component({
  selector: 'app-ws-login',
  templateUrl: './ws-login.component.html',
  styleUrls: ['./ws-login.component.css']
})
export class WsLoginComponent implements OnInit, OnDestroy {
  private subscribers: any[];
  public mamList: WsMamConnection[];
  public selectedMam: WsMamConnection;
  public isConnectionSpinnerHidden = true;
  public configuration: WsConfiguration;
  public errorMsg = [];
  public selectedDomain: string;
  public username: string;
  public password: string;

  constructor(
    private appState: WsAppStateService,
    private configService: WsConfigurationService,
    private loginService: WsLoginService) {
    this.subscribers = [];

    this.configService.getConfig()
      .subscribe(configuration => {
        this.configuration = configuration;
        this.appState.itemsPerPage = this.configuration.itemsPerPage;
        this.selectedDomain = this.configuration.domains[0];
        this.selectedMam = this.configuration.mams[0];
      });
  }

  ngOnInit() {
    const subscriber = this.loginService.loginSubject
      .subscribe(response => this.loginResponse(response));
    this.subscribers.push(subscriber);
  }

  ngOnDestroy() {
    this.subscribers.forEach(element => {
      element.unsubscribe();
    });
  }

  public onSubmit() {
    this.errorMsg = [];
    this.appState.setConnectionState(false, null);
    this.isConnectionSpinnerHidden = false;
    this.selectedMam.username = this.username;
    this.selectedMam.password = this.password;
    this.selectedMam.domain = this.selectedDomain;
    this.loginService.login(this.selectedMam);
  }

  private loginResponse(response: any) {
    this.isConnectionSpinnerHidden = true;

    if (response instanceof WsMamError) {
      const error: WsMamError = response;
      this.appState.setConnectionState(false, null);
      console.log(`Error: ${error.msg}`);
      this.errorMsg.push({ severity: 'error', detail: error.msg });
    } else {
      this.appState.setAuthHeader(response.access_token, response.token_type, response.expires_in);
      this.appState.setConnectionState(true, this.selectedMam);
      console.log(`${this.selectedMam.username} logged in`);
    }
  }
}
