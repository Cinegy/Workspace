import { Subject } from 'rxjs/Subject';
import { WsConfiguration } from './ws-configuration';
import { WsMamConnection } from './../shared/services/ws-base-mam/ws-mam-connection';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class WsConfigurationService {
  private configuration: WsConfiguration;
  public getConfigSubject: Subject<any> = new Subject<any>();

  constructor(private httpClient: HttpClient) {
    this.configuration = new WsConfiguration();
   }

  public getConfig() {
    this.httpClient.get('./assets/configuration/config.json')
      .subscribe(
        response => this.getLocalConfig(response)
      );
  }

  private getLocalConfig(response: any) {
    if (response.useRemoteConfig) {
      // tslint:disable-next-line:max-line-length
      this.httpClient.get(`${this.configuration.remoteConfigHost}/${this.configuration.configVersion}/${this.configuration.clientHost}/config.jsons`)
      .subscribe(
        remoteResponse => this.getRemoteConfig(remoteResponse),
        error => this.errorRemoteConfig(error)
      );
    } else {
      this.setConfig(response);
      this.getConfigSubject.next(this.configuration);
    }
  }

  private getRemoteConfig(response: any) {
    this.setConfig(response);
  }

  private setConfig(response: any) {
    this.configuration.mams = response.mams;
    this.configuration.domains = response.domains;
    this.configuration.itemsPerPage = response.itemsPerPage;
    this.configuration.useRemoteConfig = response.useRemoteConfig;
    this.configuration.remoteConfigHost = response.remoteConfigHost;
    this.getConfigSubject.next(this.configuration);
  }

  private errorRemoteConfig(error: any) {

  }
}
