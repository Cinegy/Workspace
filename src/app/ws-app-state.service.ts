import { Subject } from 'rxjs/Subject';
import { Router } from '@angular/router';
import { WsMamConnection } from './shared/services/ws-base-mam/ws-mam-connection';
import { Injectable } from '@angular/core';

@Injectable()
export class WsAppStateService {
  private _connected: boolean;
  private _selectedMam: WsMamConnection;

  public loggedInSubject: Subject<any> = new Subject<any>();
  public authHeader: string;
  public nodeTypes: {[type: string]: any } = {};
  public nodeIcons: {[subType: string]: any } = {};

  constructor() {
    this._connected = false;
  }

  public get connected(): boolean {
    return this._connected;
  }

  public get selectedMam(): WsMamConnection {
    return this._selectedMam;
  }

  public setConnectionState(connected: boolean, selectedMam: WsMamConnection) {
    this._connected = connected;
    this._selectedMam = selectedMam;

    if (this._connected === false) {
      this.authHeader = null;
      this._selectedMam = null;
    } else {
      this.loggedInSubject.next(true);
    }
  }

  public setAuthHeader(token: string, tokenType: string, tokenExpiration) {
    this.authHeader = `${tokenType} ${token}`;
  }
}
