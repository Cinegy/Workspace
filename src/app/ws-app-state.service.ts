import { Injectable } from '@angular/core';
import { WsMamConnection } from './shared/services/ws-base-mam/ws-mam-connection';
import { Subject } from 'rxjs/Subject';


@Injectable({
  providedIn: 'root'
})
export class WsAppStateService {
  private _connected: boolean;
  private _selectedMam: WsMamConnection;
  private _jdfRootNode: any;

  private readonly binPanelNodes=['roll', 'clipBin', 'documentBin', 'searchBin', 'document'];
  private readonly clipPlayerPanelNodes=['clip', 'masterClip'];

  public loggedInSubject: Subject<any> = new Subject<any>();
  public selectNodeSubject: Subject<any> = new Subject<any>();
  public openBinNodeSubject: Subject<any> = new Subject<any>();
  public openJdfNodeSubject: Subject<any> = new Subject<any>();
  public updateNodeSubject: Subject<any> = new Subject<any>();
  public deleteNodeSubject: Subject<any> = new Subject<any>();
  public playClipSubject: Subject<any> = new Subject<any>();
  public openNewsNodeSubject: Subject<any> = new Subject<any>();
  public openStoryNodeSubject: Subject<any> = new Subject<any>();
  public resetModuleSubject: Subject<any> = new Subject<any>();
  public selectBinNodeSubject: Subject<any> = new Subject<any>();
  public changeClipPlayerLayoutSubject: Subject<any> = new Subject<any>();

  public authHeader: string;
  public itemsPerPage: number;
  public loadedItemsChunk: number = 50;
  public tvFormats: {[type: string]: any } = {};
  public nodeTypes: {[type: string]: any } = {};
  public nodeIcons: {[subType: string]: any } = {};
  public descriptors: {[type: string]: any } = {};
  public showMode:string = 'bins';
  public layoutMode = 'large';
  public isBinOpened = false;

  private _isClipPlayerOpened = false;
  public get isClipPlayerOpened(): boolean {
    return this._isClipPlayerOpened;
  }
  public set isClipPlayerOpened(value: boolean) {
    if(this._isClipPlayerOpened != value) {
      this._isClipPlayerOpened = value;
      this.changeClipPlayerLayoutSubject.next(this._isClipPlayerOpened);
    }
  }

  public layoutSettings: any = {
    panels: [
      {
        visible: true,
        menuName: 'Explorer',
        size: 30,
        type: 'explorer'
      },
      {
        visible: true,
        menuName: 'Bins',
        size: 40,
        type: 'bin'
      },
      {
        visible: true,
        size: 30,
        childrenPanels: [
          {
            visible: true,
            menuName: 'Player',
            size: 50,
            type: 'player',
          },
          {
            visible: true,
            menuName: 'Metadata',
            size: 50,
            type: 'metadata'
          },
        ],
      },
    ]
  }

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
    if(this.binPanelNodes.includes(node.type)) {
      this.isBinOpened = true;
    } else {
      this.isBinOpened = false;
    }
    if(this.clipPlayerPanelNodes.includes(node.type)) {
      this.isClipPlayerOpened = true;
    } else {
      this.isClipPlayerOpened = false;
    }
    this.selectNodeSubject.next(node);
  }

  public openBinNode(node: any): void {

    this.resetModuleSubject.next();
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
  public openNewsNode(node:any) :void{
    this.resetModuleSubject.next();
    this.openNewsNodeSubject.next(node);
  }

  public openStoryNode(node:any): void{
    this.resetModuleSubject.next();
    this.openStoryNodeSubject.next(node);
  }
  public selectBinNode(node: any): void {
    this.selectBinNodeSubject.next(node);
  }
}
