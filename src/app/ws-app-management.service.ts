import { WsMamError } from './shared/services/ws-base-mam/ws-mam-error';
import { Subject } from 'rxjs/Subject';
import { WsAppStateService } from './ws-app-state.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { WsBaseMamService } from './shared/services/ws-base-mam/ws-base-mam.service';
import { Injectable } from '@angular/core';

@Injectable()
export class WsAppManagementService extends WsBaseMamService {
  public getTvFormatsSubject: Subject<any> = new Subject<any>();
  public getNodeTypesSubject: Subject<any> = new Subject<any>();
  public getIconsSubject: Subject<any> = new Subject<any>();
  public getDescriptorsSubject: Subject<any> = new Subject<any>();
  public mamVersionSubject: Subject<any> = new Subject<any>();
  public heartbeatSubject: Subject<any> = new Subject<any>();

  constructor(
    protected httpClient: HttpClient,
    protected appState: WsAppStateService) {
    super(httpClient, appState);
  }

  public initialize() {
    this.appState.selectNodeSubject
      .subscribe(response => this.selectedNodeResponse(response));

    this.mamVersionSubject
      .subscribe(response => this.getMamVerionResponse(response));

    this.getTvFormatsSubject
      .subscribe(response => this.getTvFormatsResponse(response));

    this.getNodeTypesSubject
      .subscribe(nodeTypes => this.getNodeTypesResponse(nodeTypes));

    this.getIconsSubject
      .subscribe(icons => this.getIconsResponse(icons));

    this.getDescriptorsSubject
      .subscribe(response => this.getDescriptorsResponse(response));

    this.get(`${this.appState.selectedMam.mamEndpoint}management/version`, this.mamVersionSubject);
    this.get(`${this.appState.selectedMam.mamEndpoint}management/videoformat/list`, this.getTvFormatsSubject);
    this.get(`${this.appState.selectedMam.mamEndpoint}management/icon/list?type=png&scope=large`, this.getIconsSubject);
    this.get(`${this.appState.selectedMam.mamEndpoint}management/nodetype/list`, this.getNodeTypesSubject);
    // tslint:disable-next-line:max-line-length
    this.get(`${this.appState.selectedMam.mamEndpoint}descriptor/list?scope.type=clipBin&scope.type=documentBin`, this.getDescriptorsSubject);
  }

  public heartbeat() {
    this.get(`${this.appState.selectedMam.mamEndpoint}node/root`, this.heartbeatSubject);
  }

  private selectedNodeResponse(response: any) {
    if (response instanceof WsMamError) {
      return;
    }

    const descriptors = this.appState.descriptors[response.type];
  }

  private getMamVerionResponse(response: any) {
    if (response instanceof WsMamError) {
      return;
    }

     this.appState.selectedMam.mamVersion = response;
  }

  private getTvFormatsResponse(response: any) {
    if (response instanceof WsMamError) {
      return;
    }

    response.forEach(tvFormat => {
      this.appState.tvFormats[tvFormat.id] = tvFormat;
    });
  }

  private getNodeTypesResponse(nodeTypes: any) {
    if (nodeTypes instanceof WsMamError) {
      console.log(`Error: ${nodeTypes.msg}`);
      return;
    }

    nodeTypes.forEach(nodeType => {
      this.appState.nodeTypes[nodeType.type] = nodeType;
    });
  }

  private getIconsResponse(icons: any) {
    if (icons instanceof WsMamError) {
      console.log(`Error: ${icons.msg}`);
      return;
    }

    icons.forEach(icon => {
      this.appState.nodeIcons[icon.type] = icon;
    });
  }

  private getDescriptorsResponse(response: any) {
    if (response instanceof WsMamError) {
      return;
    }

    this.appState.descriptors['clipBin'] = response;
    this.appState.descriptors['documentBin'] = response;
  }
}
