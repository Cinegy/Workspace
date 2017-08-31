import { SaveMetadataRequest } from './save-metadata-request';
import { Subject } from 'rxjs/Subject';
import { WsBaseMamService } from './../shared/services/ws-base-mam/ws-base-mam.service';
import { WsAppStateService } from './../ws-app-state.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class WsMetadataService extends WsBaseMamService {
  public getDescriptorsSubject: Subject<any> = new Subject<any>();
  public getMetadataSubject: Subject<any> = new Subject<any>();
  public setMetadataSubject: Subject<any> = new Subject<any>();

  constructor(
    protected httpClient: HttpClient,
    protected appState: WsAppStateService) {
    super(httpClient, appState);
  }

  public getDescriptors(type: string) {
    this.get(`${this.appState.selectedMam.mamEndpoint}descriptor/list?scope.type=${type}`, this.getDescriptorsSubject);
  }

  public getMetadata(id: string) {
    this.get(`${this.appState.selectedMam.mamEndpoint}metadata?id=${id}`, this.getMetadataSubject);
  }

  public setMetadata(id: string, metadata: SaveMetadataRequest) {
    this.post(`${this.appState.selectedMam.mamEndpoint}metadata?id=${id}`,
      [
        {
          DescriptorId: metadata.descriptorId,
          value: metadata.value
        }
      ],
      this.setMetadataSubject);
  }
}
