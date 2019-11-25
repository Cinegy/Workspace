import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { WsBaseMamService } from '../shared/services/ws-base-mam/ws-base-mam.service';
import { HttpClient } from '@angular/common/http';
import { WsAppStateService } from '../ws-app-state.service';
import { SaveMetadataRequest } from './save-metadata-request';

@Injectable({
  providedIn: 'root'
})
export class WsMetadataService extends WsBaseMamService {
  public getDescriptorsSubject: Subject<any> = new Subject<any>();
  public getMetadataSubject: Subject<any> = new Subject<any>();
  public setMetadataSubject: Subject<any> = new Subject<any>();
  public undoSetMetadataSubject: Subject<any> = new Subject<any>();

  constructor(
    protected httpClient: HttpClient,
    protected appState: WsAppStateService) {
    super(httpClient, appState);
  }

  public getDescriptors(type: string) {
    // tslint:disable-next-line:max-line-length
    //this.get(`${this.appState.selectedMam.mamEndpoint}descriptor/list?type=${type}&category=predefined&category=system&category=metadata`, this.getDescriptorsSubject);
    this.get(`${this.appState.selectedMam.mamEndpoint}descriptor/list?scope.type=${type}&category=predefined&category=system&category=metadata`, this.getDescriptorsSubject);
  
  }

  public getMetadata(node: any) {
  
    this.get(`${this.appState.selectedMam.mamEndpoint}metadata?id=${node.id}`, this.getMetadataSubject);
  //alert(this.getMetadataSubject);
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

  public undoSetMetadata(id: string, metadata: SaveMetadataRequest) {
    this.post(`${this.appState.selectedMam.mamEndpoint}metadata?id=${id}`,
      [
        {
          DescriptorId: metadata.descriptorId,
          value: metadata.value
        }
      ],
      this.undoSetMetadataSubject);
  }
}
