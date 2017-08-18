import { WsMamConnection } from './shared/services/ws-base-mam/ws-mam-connection';
import { Injectable } from '@angular/core';

@Injectable()
export class WsAppStateService {
  private _connected: boolean;
  private _selectedMam: WsMamConnection;
  public authHeader: string;

  constructor() {
    this.connected = false;
  }

  public get connected(): boolean {
    return this._connected;
  }

  public set connected(value: boolean) {
    if (value === undefined) {
      throw  new Error('Please supply Connected value');
    }

    this._connected = value;

    if (this._connected === false) {
      this.authHeader = null;
      this._selectedMam = null;
    }
  }

  public get selectedMam(): WsMamConnection {
    return this._selectedMam;
  }

  public set selectedMam(value: WsMamConnection) {
    if (value === undefined) {
      throw  new Error('Please supply Mam Connection info');
    }

    this._selectedMam = value;
  }

  public setAuthHeader(token: string, tokenType: string, tokenExpiration) {
    this.authHeader = `${tokenType} ${token}`;
  }
}
