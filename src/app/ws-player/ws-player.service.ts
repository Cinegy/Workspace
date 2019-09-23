import { Injectable } from '@angular/core';
import { WsBaseMamService } from '../shared/services/ws-base-mam/ws-base-mam.service';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { WsAppStateService } from '../ws-app-state.service';
import { WsMamError } from '../shared/services/ws-base-mam/ws-mam-error';

@Injectable()
export class WsPlayerService extends WsBaseMamService {
  public getMasterClipSubject: Subject<any> = new Subject<any>();
  public getClipDescriptorSubject: Subject<any> = new Subject<any>();
  public getMasterclipDescriptorSubject: Subject<any> = new Subject<any>();
  public setMarkerSubject: Subject<any> = new Subject<any>();
  public createSubclipSubject: Subject<any> = new Subject<any>();

  private internalCreateSubclipFromClipSubject: Subject<any> = new Subject<any>();
  private selectedClip: any;
  private clipDescriptors: { [id: string]: any; } = {};

  constructor(
    protected httpClient: HttpClient,
    protected appState: WsAppStateService) {
    super(httpClient, appState);

    this.getClipDescriptorSubject
      .subscribe(response => this.getClipDescriptorsResponse(response));

    this.internalCreateSubclipFromClipSubject
      .subscribe(response => this.createSubclipResponse(response));
  }

  public getClipDescriptors() {
    // tslint:disable-next-line:max-line-length
    this.get(`${this.appState.selectedMam.mamEndpoint}descriptor/list?scope.type=clip&category=predefined`, this.getClipDescriptorSubject);
  }

  public getMasterclip(id: string) {
    // tslint:disable-next-line:max-line-length
    this.get(`${this.appState.selectedMam.mamEndpoint}masterclip?id=${id}&masterClipScope=videoFormat&masterClipScope=offsets&masterClipScope=fileSet&masterClipScope=thumbnail&masterClipScope=general`, this.getMasterClipSubject);
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
  }

  public createSubclipFromClip(clip: any) {
    this.selectedClip = clip;


    // tslint:disable-next-line:max-line-length
    this.post(`${this.appState.selectedMam.mamEndpoint}node/copy?id=${clip.id}&parentId=${clip.parent}&dataScope=fullInfo&linksScope=metadata`, null, this.internalCreateSubclipFromClipSubject);
  }

  public createSubclipFromMasterclip(clip: any) {
    this.selectedClip = clip;

    //alert(clip.id +" in  "+clip.in+" out  "+clip.out);
    let in_ = 222400000;
    let out_ = 300000000;
    // tslint:disable-next-line:max-line-length
    this.post(`${this.appState.selectedMam.mamEndpoint}masterclip/createsubclip?masterclipId=${clip.id}&in=${in_}&out=${out_}&thumbnailPosition=0&clipScope=videoFormat&clipScope=offsets&clipScope=thumbnail&clipScope=general&clipScope=fileset`, null, this.createSubclipSubject);
  
  }

  private createSubclipResponse(response) {
    if (response instanceof WsMamError) {
      return;
    }

    response.tapeIn = this.selectedClip.in + this.selectedClip.tapeIn;
    response.tapeOut = this.selectedClip.out + this.selectedClip.tapeIn;
    response.in = 0;
    response.out = response.tapeOut - response.tapeIn;

    this.post(`${this.appState.selectedMam.mamEndpoint}metadata?id=${response.id}`,
      [
        {
          DescriptorId: this.clipDescriptors['pd_in'].id,
          value: response.in
        },
        {
          DescriptorId: this.clipDescriptors['pd_out'].id,
          value: response.out
        },
        {
          DescriptorId: this.clipDescriptors['pd_tape_in'].id,
          value: response.tapeIn
        },
        {
          DescriptorId: this.clipDescriptors['pd_tape_out'].id,
          value: response.tapeOut
        }
      ], null);

    this.createSubclipSubject.next(response);
  }

  private getClipDescriptorsResponse(response) {
    if (response instanceof WsMamError) {
      return;
    }

    response.forEach(descriptor => {
      this.clipDescriptors[descriptor.nameInternal] = descriptor;
    });

  }

}
