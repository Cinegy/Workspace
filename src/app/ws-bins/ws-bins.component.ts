import { BinNode } from './bin-node';
import { WsBinsService } from './ws-bins.service';
import { WsMamError } from './../shared/services/ws-base-mam/ws-mam-error';
import { WsAppManagementService } from './../ws-app-management.service';
import { WsAppStateService } from './../ws-app-state.service';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-ws-bins',
  templateUrl: './ws-bins.component.html',
  styleUrls: ['./ws-bins.component.css']
})
export class WsBinsComponent implements OnInit, OnDestroy {
  public subscribers: any[];
  public lastOpenedNode: any;
  public tabs: BinNode[];
  public selectedIndex = 0;
  public loading = false;

  constructor(
    public appState: WsAppStateService,
    public management: WsAppManagementService,
    private binService: WsBinsService) {
    this.subscribers = [];
    this.tabs = [];

    let subscriber = this.appState.openNodeSubject
      .subscribe(response => this.openNodeResponse(response));
    this.subscribers.push(subscriber);

    subscriber = this.appState.deleteNodeSubject
      .subscribe(response => this.nodeDeletedResponse(response));
    this.subscribers.push(subscriber);

    subscriber = this.appState.updateNodeSubject
      .subscribe(response => this.nodeUpdatedResponse(response));
    this.subscribers.push(subscriber);

    subscriber = this.binService.getRollSubject
      .subscribe(response => this.getParentResponse(response));
    this.subscribers.push(subscriber);

    subscriber = this.binService.getClipBinSubject
      .subscribe(response => this.getParentResponse(response));
    this.subscribers.push(subscriber);

    subscriber = this.binService.getChildrenSubject
      .subscribe(response => this.getChildrenResponse(response));
    this.subscribers.push(subscriber);

  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.subscribers.forEach(element => {
      element.unsubscribe();
    });
  }

  private closeTab(tab: BinNode) {
    const index = this.tabs.indexOf(tab);

    if (index > -1) {
      this.tabs.splice(index, 1);
    }
  }

  private selectTab() {
    if (this.selectedIndex === -1) {
      return;
    }

    this.appState.selectNode(this.tabs[this.selectedIndex].parent);
  }

  private selectItem(item: any) {
    this.appState.selectNode(item);
  }

  private openNodeResponse(response: any) {
    if (response instanceof WsMamError) {
      return;
    }

    switch (response.type) {
      case 'roll':
        this.binService.getRoll(response.id);
        this.loading = true;
        break;
      case 'clipBin':
        this.binService.getClipBin(response.id);
        this.loading = true;
        break;
      case 'documentBin':
        this.lastOpenedNode = response;
        this.binService.getChildren(this.lastOpenedNode.id);
        this.loading = true;
        break;
    }
  }

  private getParentResponse(response: any) {
    this.loading = false;
    if (response instanceof WsMamError) {
      this.lastOpenedNode = null;
      return;
    }

    this.lastOpenedNode = response;
    this.loading = true;
    this.binService.getChildren(this.lastOpenedNode.id);
  }

  private getChildrenResponse(response: any) {
    this.loading = false;
    if (response instanceof WsMamError) {
      this.lastOpenedNode = null;
      return;
    }

    const bin = new BinNode();
    bin.parent = this.lastOpenedNode;
    bin.children = response.items;
    bin.childCount = response.totalCount;

    this.tabs.push(bin);
    this.selectedIndex = this.tabs.length - 1;
  }

  private nodeDeletedResponse(response) {
    if (response instanceof WsMamError) {
      return;
    }
    // tslint:disable-next-line:prefer-const
    for (let tab of this.tabs) {
      if (tab.parent.id === response.id) {
        this.closeTab(tab);
      }
    }
  }

  private nodeUpdatedResponse(response) {
    if (response instanceof WsMamError) {
      return;
    }
    // tslint:disable-next-line:prefer-const
    for (let i = 0; i < this.tabs.length; i++) {
      if (this.tabs[i].parent.id === response.id) {
        this.tabs[i].parent = response;
      }
    }
  }
}
