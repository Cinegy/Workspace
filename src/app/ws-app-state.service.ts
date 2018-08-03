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

import { WsConfigurationService } from './ws-configuration/ws-configuration.service';
import { WsBaseMamService } from './shared/services/ws-base-mam/ws-base-mam.service';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs/Subject';
import { Router } from '@angular/router';
import { WsMamConnection, WsCisConfiguration } from './shared/services/ws-base-mam/ws-mam-connection';
import { Injectable } from '@angular/core';

@Injectable()
export class WsAppStateService {
  private _connected: boolean;
  private _selectedMam: WsMamConnection;
  private _jdfRootNode: any;

  public loggedInSubject: Subject<any> = new Subject<any>();
  public selectNodeSubject: Subject<any> = new Subject<any>();
  public openBinNodeSubject: Subject<any> = new Subject<any>();
  public openJdfNodeSubject: Subject<any> = new Subject<any>();
  public updateNodeSubject: Subject<any> = new Subject<any>();
  public deleteNodeSubject: Subject<any> = new Subject<any>();
  public playClipSubject: Subject<any> = new Subject<any>();

  public authHeader: string;
  public itemsPerPage: number;
  public tvFormats: {[type: string]: any } = {};
  public nodeTypes: {[type: string]: any } = {};
  public nodeIcons: {[subType: string]: any } = {};
  public descriptors: {[type: string]: any } = {};

  constructor() {
    this._connected = false;
  }

  public get connected(): boolean {
    return this._connected;
  }

  public get selectedMam(): WsMamConnection {
    return this._selectedMam;
  }

  public get jdfRootNode(): any {
    return this._jdfRootNode;
  }

  public set jdfRootNode(value: any) {
    this._jdfRootNode = value;
  }

  public setConnectionState(connected: boolean, selectedMam: WsMamConnection): void {
    this._connected = connected;
    this._selectedMam = selectedMam;

    if (this._connected === false) {
      this.authHeader = null;
      this._selectedMam = null;
    } else {
      this._selectedMam.loginTime = new Date(Date.now());
      this.loggedInSubject.next(true);
    }
  }

  public setAuthHeader(token: string, tokenType: string, tokenExpiration): void {
    this.authHeader = `${tokenType} ${token}`;
  }

  public selectNode(node: any): void {
    this.selectNodeSubject.next(node);
  }

  public openBinNode(node: any): void {
    this.openBinNodeSubject.next(node);
  }

  public openJdfNode(node: any): void {
    this.openJdfNodeSubject.next(node);
  }

  public updateNode(node: any): void {
    this.updateNodeSubject.next(node);
  }

  public deleteNode(node: any): void {
    this.deleteNodeSubject.next(node);
  }

  public playClip(node: any): void {
    this.playClipSubject.next(node);
  }
}
