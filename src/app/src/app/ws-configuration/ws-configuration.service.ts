import { Injectable } from '@angular/core';
import { WsConfiguration } from './ws-configuration';
import { Subject } from 'rxjs';
import { Observable } from 'rxjs/Rx';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class WsConfigurationService {

  public configuration: WsConfiguration;
  public getConfigSubject: Subject<any> = new Subject<any>();

  constructor(private httpClient: HttpClient) {
    this.configuration = new WsConfiguration();
  }
  

  public getVersion() {
    return `${this.configuration.major}.${this.configuration.minor}.${this.configuration.commit}`;
  }

  public getConfig() {
    return new Promise((resolve, reject) => {
      this.httpClient
        .get('./assets/configuration/config.json')
        .catch(error => {
          console.log('Configuration file "config.json" could not be read');
          resolve(true);
          return Observable.throw(error);
        }).subscribe(config => {
          this.getLocalConfig(config);
          resolve(true);
        });
    });
  }
   private getLocalConfig(response: any) {
    return new Promise((resolve, reject) => {
      if (response.useRemoteConfig) {
        this.setConfig(response);
        // tslint:disable-next-line:max-line-length
        const url = `${this.configuration.remoteConfigHost}/${this.configuration.configVersion}/${this.configuration.clientHost}/config.json`;
        console.log(`Using remote configuration: ${url}`);
        this.httpClient.get(url)
          .subscribe(
            remoteResponse => {
              this.getRemoteConfig(remoteResponse);
              resolve(true);
            },
            error => {
              this.errorRemoteConfig(error);
              reject(error);
            });
      } else {
        console.log(`Using local configuration`);
        this.setConfig(response);
        resolve(true);
      }
    });
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
    this.configuration.cis = response.cis;
  }

  private errorRemoteConfig(error: any) {
    console.log(`Configuration error: ${error.statusText}, ${error.status}`);
  }

}
