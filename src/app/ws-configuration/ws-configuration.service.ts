import { WsConfiguration } from './ws-configuration';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class WsConfigurationService {

  constructor(private httpClient: HttpClient) { }

  public getConfig(): Observable<WsConfiguration[]>  {
    return this.httpClient.get('./assets/configuration/config.json') as (Observable<WsConfiguration[]>);
  }
}
