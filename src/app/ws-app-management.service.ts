/*
Cinegy Workspace - An HTML5 Front-End to Cinegy Archive
Copyright (C) 2018  Cinegy GmbH
 
	This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
	
*/


import { Injectable } from '@angular/core';
import { WsBaseMamService } from './shared/services/ws-base-mam/ws-base-mam.service';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { WsAppStateService } from './ws-app-state.service';
import { WsMamError } from './shared/services/ws-base-mam/ws-mam-error';

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
   // this.get(`${this.appState.selectedMam.mamEndpoint}management/icon/list?type=png&scope=large`, this.getIconsSubject);
    this.get(`${this.appState.selectedMam.mamEndpoint}management/icon/list?scope.type=png&scope=large`, this.getIconsSubject);
   
    this.get(`${this.appState.selectedMam.mamEndpoint}management/nodetype/list`, this.getNodeTypesSubject);
    // tslint:disable-next-line:max-line-length
   // this.get(`${this.appState.selectedMam.mamEndpoint}descriptor/list?type=clipBin&type=documentBin&category=predefined&category=system&category=metadata`, this.getDescriptorsSubject);
    this.get(`${this.appState.selectedMam.mamEndpoint}descriptor/list?scope.type=clipBin&type=documentBin&category=predefined&category=system&category=metadata`, this.getDescriptorsSubject);
  }

  public heartbeat() {
    this.get(`${this.appState.selectedMam.mamEndpoint}node/root`, this.heartbeatSubject, 'heartbeat');
  }
 // private selectedNodeResponse(response: any) {

  public selectedNodeResponse(response: any) {
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
