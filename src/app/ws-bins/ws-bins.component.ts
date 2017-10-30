import { ClipboardItem, ClipboardAction } from './clipboard-item';
import { WsDeleteDialogComponent } from './../ws-dialogs/ws-delete-dialog/ws-delete-dialog.component';
import { MatDialog } from '@angular/material';
import { MenuItem } from 'primeng/primeng';
import { WsVideoTools } from './../ws-player/ws-video-tools';
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
  private videoHelper = new WsVideoTools();
  private internalClipboardItem: ClipboardItem = null;
  public subscribers: any[];
  public lastOpenedNode: any;
  public deletedNode = null;
  public tabs: BinNode[];
  public contextMenuItems: MenuItem[];
  public selectedIndex = 0;
  public loading = false;
  public pageSize: number;
  public pageSizeOptions = [5, 10, 25, 50];

  constructor(
    public appState: WsAppStateService,
    public management: WsAppManagementService,
    private binService: WsBinsService,
    public dialog: MatDialog) {
    this.subscribers = [];
    this.tabs = [];
    this.contextMenuItems = [];

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

    subscriber = this.binService.getDocumentBinSubject
      .subscribe(response => this.getParentResponse(response));
    this.subscribers.push(subscriber);

    subscriber = this.binService.getChildrenSubject
      .subscribe(response => this.getChildrenResponse(response));
    this.subscribers.push(subscriber);

    subscriber = this.binService.startSearchSubject
      .subscribe(response => this.startSearchResponse(response));
    this.subscribers.push(subscriber);

    subscriber = this.binService.searchSubject
      .subscribe(response => this.getChildrenResponse(response));
    this.subscribers.push(subscriber);

    subscriber = this.binService.deleteNodeSubject
      .subscribe(response => this.deleteBinItemResponse(response));
    this.subscribers.push(subscriber);

    subscriber = this.binService.copyClipSubject
      .subscribe(response => this.pasteClipResponse(response));
    this.subscribers.push(subscriber);

    subscriber = this.binService.linkMasterclipSubject
      .subscribe(response => this.pasteClipResponse(response));
    this.subscribers.push(subscriber);

    subscriber = this.binService.cutClipSubject
      .subscribe(response => this.cutClipResponse(response));
    this.subscribers.push(subscriber);

  }

  ngOnInit() {
    this.pageSize = this.appState.itemsPerPage;
  }

  ngOnDestroy() {
    this.subscribers.forEach(element => {
      element.unsubscribe();
    });
  }

  public closeTab(tab: BinNode) {
    const index = this.tabs.indexOf(tab);

    if (index > -1) {
      this.tabs.splice(index, 1);
    }
  }

  public selectTab() {
    if (this.selectedIndex === -1) {
      return;
    }

    this.lastOpenedNode = this.tabs[this.selectedIndex].parent;
  }

  public playClip(node: any) {
    if (node === null) {
      return;
    }

    this.appState.playClip(node);
    console.log(`Play Clip: ${node.name}`);
  }

  private selectItem(item: any) {
    this.appState.selectNode(item);
  }

  private getThumbnail(node: any) {
    if (node.type === 'image') {
      return this.videoHelper.getThumbnailUrl(node, this.appState.selectedMam);
    } else {
      return this.videoHelper.getThumbnailUrl(node, this.appState.selectedMam, node.videoFormat);
    }
  }
  /* *** Page events *** */
  private pageEvent(event) {
    const tab = this.tabs[this.selectedIndex];
    const skip = (event.pageIndex) * event.pageSize;
    this.loading = true;
    if (tab.parent.type === 'searchBin') {
      this.binService.search(tab.parent.name, event.pageSize, skip);
    } else {
      this.binService.getChildren(this.tabs[this.selectedIndex].parent.id, event.pageSize, skip);
    }
  }
  /* *** Service Response *** */
  private openNodeResponse(response: any) {
    if (response instanceof WsMamError) {
      return;
    }

    this.loading = true;
    this.binService.getBin(response.id, response.type);
  }

  private getParentResponse(response: any) {
    this.loading = false;
    if (response instanceof WsMamError) {
      this.lastOpenedNode = null;
      return;
    }

    this.lastOpenedNode = response;
    this.loading = true;
    this.binService.getChildren(this.lastOpenedNode.id, this.lastOpenedNode.type);
  }

  private getChildrenResponse(response: any) {
    this.loading = false;

    if (response instanceof WsMamError) {
      this.lastOpenedNode = null;
      return;
    }

    for (let i = 0; i < this.tabs.length; i++) {
      const tab = this.tabs[i];
      if (
        (tab.parent.type === 'searchBin' && this.lastOpenedNode.type === 'searchBin' && tab.parent.name === this.lastOpenedNode.name) ||
        (tab.parent.id && this.lastOpenedNode.id && tab.parent.id === this.lastOpenedNode.id)) {
        tab.children = response.items;

        if (this.selectedIndex !== i) {
          this.selectedIndex = i;
        }
        return;
      }
    }

    const bin = new BinNode();
    bin.parent = this.lastOpenedNode;
    bin.children = response.items;
    bin.childCount = response.totalCount;

    this.tabs.push(bin);
    this.selectedIndex = this.tabs.length - 1;
  }

  private startSearchResponse(keywords: string) {
    this.loading = true;
    this.lastOpenedNode = { name: keywords, type: 'searchBin' };
  }

  private nodeDeletedResponse(response) {
    if (response instanceof WsMamError) {
      return;
    }

    for (const tab of this.tabs) {
      if (tab.parent.id === response.id) {
        this.closeTab(tab);
      }
    }
  }

  private nodeUpdatedResponse(response) {
    if (response instanceof WsMamError) {
      return;
    }

    for (let i = 0; i < this.tabs.length; i++) {
      if (this.tabs[i].parent.id === response.id) {
        this.tabs[i].parent = response;
      }
    }
  }

  private deleteBinItemResponse(response) {
    if (response instanceof WsMamError) {
      return;
    }

    if (this.deletedNode === null) {
      return;
    }

    const index = this.tabs[this.selectedIndex].children.indexOf(this.deletedNode);

    if (index > -1) {
      this.tabs[this.selectedIndex].children.splice(index, 1);
      this.tabs[this.selectedIndex].childCount--;
      this.deletedNode = null;
    }

  }

  private pasteClipResponse(response) {
    if (response instanceof WsMamError) {
      return;
    }

    this.tabs[this.selectedIndex].children.push(response);
    this.tabs[this.selectedIndex].childCount++;
  }

  private cutClipResponse(response) {
    if (response instanceof WsMamError) {
      return;
    }

    for (let i = 0; i < this.tabs.length; i++) {
      if (this.tabs[i].parent.id === this.internalClipboardItem.bin.parent.id) {
        const index = this.tabs[i].children.indexOf(this.internalClipboardItem.item);

        if (index > -1) {
          this.tabs[i].children.splice(index, 1);
          this.tabs[i].childCount--;
        }

        this.internalClipboardItem = null;
        return;
      }
    }
    this.internalClipboardItem = null;
  }

  /* *** Dialogs *** */
  private openDeleteNodeDialog(selectedNode: any) {
    const dialogRef = this.dialog.open(WsDeleteDialogComponent, {
      width: '400px',
      data: selectedNode.name
    });
    dialogRef.afterClosed().subscribe(result => {
      if (!result) {
        return;
      }

      console.log(`Delete Node`);
      this.deletedNode = selectedNode;
      this.binService.deleteNode(selectedNode.id);
    });
  }

  /* *** Context Menu *** */
  private contextMenuOpen(selectedNode: any, child: boolean) {
    let menuItem: any;

    const playable = {};
    playable['clip'] = true;
    playable['masterClip'] = true;

    this.contextMenuItems = [];
    const selectedNodeType = this.appState.nodeTypes[selectedNode.type];

    if (child) {
      if (selectedNode.type in playable) {
        menuItem = {
          label: 'Play',
          icon: 'fa-play-circle-o',
          command: (event) => {
            this.playClip(selectedNode);
          }
        };
        this.contextMenuItems.push(menuItem);
      }

      if (selectedNode.type in playable && selectedNode.type !== 'masterClip') {
        menuItem = {
          label: 'Cut',
          icon: 'fa-scissors',
          command: (event) => {
            this.internalClipboardItem = new ClipboardItem();
            this.internalClipboardItem.action = ClipboardAction.Cut;
            this.internalClipboardItem.item = selectedNode;
            this.internalClipboardItem.bin = this.tabs[this.selectedIndex];
          }
        };
        this.contextMenuItems.push(menuItem);
      }

      menuItem = {
        label: 'Copy',
        icon: 'fa-files-o',
        command: (event) => {
          this.internalClipboardItem = new ClipboardItem();
          this.internalClipboardItem.action = ClipboardAction.Copy;
          this.internalClipboardItem.item = selectedNode;
          this.internalClipboardItem.bin = null;
        }
      };
      this.contextMenuItems.push(menuItem);

      menuItem = {
        label: 'Paste',
        disabled: (this.internalClipboardItem === null) && this.tabs[this.selectedIndex].parent.type !== 'clipBin',
        icon: 'fa-clipboard',
        command: (event) => {
          switch (this.internalClipboardItem.item.type) {
            case 'masterClip':
              this.binService.linkMasterclip(this.internalClipboardItem.item.id, this.tabs[this.selectedIndex].parent.id);
              this.internalClipboardItem = null;
              break;
            case 'clip':
              if (this.internalClipboardItem.action === ClipboardAction.Copy) {
                this.binService.copyClip(this.internalClipboardItem.item.id, this.tabs[this.selectedIndex].parent.id);
                this.internalClipboardItem = null;
              } else if (this.internalClipboardItem.action === ClipboardAction.Cut) {
                this.binService.cutClip(this.internalClipboardItem, this.tabs[this.selectedIndex].parent.id);
              }
              break;
          }
        }
      };
      this.contextMenuItems.push(menuItem);

      if (selectedNodeType.canDelete) {
        menuItem = {
          label: 'Delete',
          icon: 'fa-trash-o',
          command: (event) => {
            this.openDeleteNodeDialog(selectedNode);
          }
        };
        this.contextMenuItems.push(menuItem);
      }
    }
  }

}
