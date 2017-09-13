import { Subject } from 'rxjs/Subject';
import { WsConfiguration } from './ws-configuration';
import { WsMamConnection } from './../shared/services/ws-base-mam/ws-mam-connection';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class WsConfigurationService {
  public configuration: WsConfiguration;
  public getConfigSubject: Subject<any> = new Subject<any>();

  constructor(private httpClient: HttpClient) {
    this.configuration = new WsConfiguration();
  }
  public getVersion() {
    return `${this.configuration.major}.${this.configuration.minor}.${this.configuration.commit}.${this.configuration.build}`;
  }
  public getConfig() {
    this.httpClient.get('./assets/configuration/config.json')
      .subscribe(
      response => this.getLocalConfig(response)
      );
  }

  private getLocalConfig(response: any) {
    if (response.useRemoteConfig) {
      this.setConfig(response);
      const url = `${this.configuration.remoteConfigHost}/${this.configuration.configVersion}/${this.configuration.clientHost}/config.json`;
      console.log(`Using remote configuration: ${url}`);
      // tslint:disable-next-line:max-line-length
      this.httpClient.get(url)
        .subscribe(
        remoteResponse => this.getRemoteConfig(remoteResponse),
        error => this.errorRemoteConfig(error)
        );
    } else {
      console.log(`Using local configuration`);
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
    console.log(`Configuration error: ${error.statusText}, ${error.status}`);
  }
}
