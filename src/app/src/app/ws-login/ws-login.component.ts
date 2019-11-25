import { Component, OnInit, OnDestroy } from '@angular/core';
import { WsConfiguration } from '../ws-configuration/ws-configuration';
import { WsMamConnection } from '../shared/services/ws-base-mam/ws-mam-connection';
import { Router } from '@angular/router';
import { WsLoginService } from './ws-login.service';
import { WsConfigurationService } from '../ws-configuration/ws-configuration.service';

import { LocalStorageService } from 'angular-2-local-storage';
import { WsMamError } from '../shared/services/ws-base-mam/ws-mam-error';
import { WsCisService } from '../shared/services/ws-cis/ws-cis.service';
import { WsAppStateService } from '../ws-app-state.service';

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

  constructor(private appState: WsAppStateService,
    private configService: WsConfigurationService,
    private loginService: WsLoginService,
    private cisService: WsCisService,
    //private storageService: LocalStorageService,
    private router: Router) {
    this.subscribers = [];

  }

  ngOnInit() {
    const subscriber = this.loginService.loginSubject
      .subscribe(response => this.loginResponse(response));
    this.subscribers.push(subscriber);

    this.init(this.configService.configuration);
    
if(this.configService.configuration.cis.useCis && !this.cisService.isLoggedIn()){
  const success:Promise<boolean>=this.cisService.completeAuthentication();
  success.then(result=>{
    if(!result){

      this.router.navigate(['/cisLogin']);
    }
  });


}


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
    this.selectedMam.cis = this.configuration.cis;
    this.loginService.login(this.selectedMam, false);

  }
  public init(config: WsConfiguration) {
    this.configuration = config;
    this.selectedDomain = this.configuration.domains[0];
    this.selectedMam = this.configuration.mams[0];

  }
  public loginResponse(response: any) {
    this.isConnectionSpinnerHidden = true;

    if (response instanceof WsMamError) {
      const error: WsMamError = response;
      this.appState.setConnectionState(false, null);
      console.log('Error: ${error.msg}');
      this.errorMsg.push({ severity: 'error', detail: error.msg });
    }
    else {
      this.appState.setAuthHeader(response.access_token, response.token_type, response.expires_in);

      this.appState.setConnectionState(true, this.selectedMam);
      console.log(`${this.selectedMam.username} logged in`);
      console.log("toke :"+response.access_token);

    }

  }

}
