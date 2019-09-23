import { Injectable } from '@angular/core';
import { WsCisConfiguration } from '../ws-base-mam/ws-mam-connection';
import { Router } from '@angular/router';
import { WsConfigurationService } from 'src/app/ws-configuration/ws-configuration.service';
import { UserManager, Log, MetadataService, User, OidcClient, UserManagerSettings, WebStorageStateStore } from 'oidc-client';

@Injectable({
  providedIn: 'root'
})
export class WsCisService {
  private settings: UserManagerSettings;
  private mgr: UserManager;
  public user: User = null;

  constructor(private config: WsConfigurationService, private router: Router) {
    Log.logger = console;
    this.init(this.config.configuration.cis);
   
  }

  private init(cisConfig: WsCisConfiguration): void {
  
    const location =window.location.origin.replace('/cislogin', '');
    this.settings = {
      authority: cisConfig.cisEndpoint,
      client_id: cisConfig.clientId,
      response_type: 'id_token token',
      scope: 'openid profile',
      loadUserInfo: true,
      filterProtocolClaims: true,
      automaticSilentRenew: true,
      userStore: new WebStorageStateStore({store: window.localStorage}),
      redirect_uri: `${location}/login`,
      post_logout_redirect_uri: location,
      silent_redirect_uri: `${location}/assets/silent/silent.html`
    };

    this.mgr = new UserManager(this.settings);
    this.mgr.events.addAccessTokenExpiring(() => {
      console.log('Token expiring');
    });
    this.mgr.events.addUserLoaded((user) => {
      this.user = user;
    });
    this.mgr.events.addSilentRenewError((err) => {
      console.log(err);
    });

    this.mgr.getUser()
      .then((user) => {
        if (user) {
          this.user = user;
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  public isLoggedIn(): boolean {
    return this.user != null && !this.user.expired;
  }

  public startAuthentication(): void {
    this.mgr.signinRedirect();
  }


  public completeAuthentication(): Promise<boolean> {
    return this.mgr.signinRedirectCallback()
      .then(user => {
        this.user = user;
        return true;
      })
      .catch(err => {
        console.log(err);
        return false;
      });
  }

  public logout(): Promise<void> {
    return this.mgr.signoutRedirect();
  }
}


