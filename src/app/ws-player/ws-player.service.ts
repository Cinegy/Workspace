import { WsAppStateService } from './../ws-app-state.service';
import { HttpClient } from '@angular/common/http';
import { WsBaseMamService } from './../shared/services/ws-base-mam/ws-base-mam.service';
import { Subject } from 'rxjs/Subject';
import { Injectable } from '@angular/core';

@Injectable()
export class WsPlayerService extends WsBaseMamService {
  public getMasterClipSubject: Subject<any> = new Subject<any>();
  public getClipDescriptorSubject: Subject<any> = new Subject<any>();
  public getMasterclipDescriptorSubject: Subject<any> = new Subject<any>();
  public setMarkerSubject: Subject<any> = new Subject<any>();

  constructor(
    protected httpClient: HttpClient,
    protected appState: WsAppStateService) {
    super(httpClient, appState);
  }

  public getClipDescriptors() {
    // tslint:disable-next-line:max-line-length
    this.get(`${this.appState.selectedMam.mamEndpoint}descriptor/list?scope.type=clip&scope.category=predefined`, this.getClipDescriptorSubject);
  }

  public getMasterclip(id: string) {
    this.get(`${this.appState.selectedMam.mamEndpoint}masterclip?id=${id}`, this.getMasterClipSubject);
  }

  public setMarker(id: string, markIn: number, markOut: number, markInDesc: string, markOutDesc: string) {
    const markerMetadata = [
      {
        DescriptorId: markInDesc,
        Value: markIn.toFixed()
      },
      {
        DescriptorId: markOutDesc,
        Value: markOut.toFixed()
      }
    ];
    this.post(`${this.appState.selectedMam.mamEndpoint}metadata?id=${id}`, markerMetadata, this.setMarkerSubject);

    // const markers = {
    //   In: markIn.toFixed(),
    //   Out: markOut.toFixed()
    // };

    // this.post(`${this.appState.selectedMam.mamEndpoint}node?id=${id}`, markers, this.setMarkerSubject);
  }

}
