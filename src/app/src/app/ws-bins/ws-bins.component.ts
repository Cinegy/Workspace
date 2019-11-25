import { Component, OnInit, OnDestroy } from '@angular/core';
import { BinNode } from './bin-node';
import { MenuItem } from 'primeng/primeng';
import { WsAppStateService } from '../ws-app-state.service';
import { MatDialog, MatSnackBar, PageEvent } from '@angular/material';
import { WsClipboardService, ClipboardAction } from '../ws-clipboard/ws-clipboard.service';
import { WsBinsService } from './ws-bins.service';
import { WsAppManagementService } from '../ws-app-management.service';
import { WsMamError } from '../shared/services/ws-base-mam/ws-mam-error';
import { WsVideoTools } from '../ws-player/ws-video-tools';
import { WsPlayerService } from '../ws-player/ws-player.service';
import { WsDeleteDialogComponent } from '../ws-dialogs/ws-delete-dialog/ws-delete-dialog.component';
import { WsJdfDialogComponent } from '../ws-dialogs/ws-jdf-dialog/ws-jdf-dialog.component';
import { SaveMetadataRequest } from '../ws-metadata/save-metadata-request';
import { WsMetadataService } from '../ws-metadata/ws-metadata.service';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-ws-bins',
  templateUrl: './ws-bins.component.html',
  styleUrls: ['./ws-bins.component.css']
})
export class WsBinsComponent implements OnInit, OnDestroy {

  public getRollSubject: Subject<any> = new Subject<any>();
  private videoHelper = new WsVideoTools();


  public subscribers: any[];
  public lastOpenedNode: any;
  public selectedNode: any;
  public deletedNode = null;
  public tabs: BinNode[];
  public contextMenuItems: MenuItem[];
  public selectedIndex = 0;
  public loading = false;
  public pageSize: number;
  public pageSizeOptions = [5, 10, 25, 50];
  public menuNode: any;
  public childOpenedMenu: boolean;
  public menuSelectedTabIndex: number;
  private playable = {};
  private cutable = {};
  private copyable = {};
  private pasteable = {};
  private openable = {};
  private exportable = {};
  private pasteTypesAllowedInClipBin = {};
  private pasteTypesAllowedInDocumentBin = {};
  private speechtotext_descriptionID;

  constructor(
    private httpClient: HttpClient,
    public metadataService: WsMetadataService,
    public appState: WsAppStateService,
    public management: WsAppManagementService,
    private binService: WsBinsService,
    private clipboard: WsClipboardService,
    private playerService: WsPlayerService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar) {
    this.subscribers = [];
    this.tabs = [];
    this.contextMenuItems = [];

    this.openable['clipBin'] = true;
    this.openable['documentBin'] = true;
    this.openable['roll'] = true;

    this.playable['clip'] = true;
    this.playable['masterClip'] = true;

    this.cutable['clip'] = true;
    this.cutable['document'] = true;
    this.cutable['image'] = true;

    this.copyable['masterClip'] = true;
    this.copyable['clip'] = true;
    this.copyable['document'] = true;
    this.copyable['image'] = true;

    this.pasteable['clipBin'] = true;
    this.pasteable['documentBin'] = true;

    this.exportable['masterClip'] = true;
    this.exportable['clip'] = true;
    this.exportable['document'] = true;
    this.exportable['clipBin'] = true;
    this.exportable['documentBin'] = true;
    this.exportable['roll'] = true;
    this.exportable['sequence'] = true;

    this.pasteTypesAllowedInClipBin['clip'] = true;
    this.pasteTypesAllowedInClipBin['masterClip'] = true;

    this.pasteTypesAllowedInDocumentBin['document'] = true;
    this.pasteTypesAllowedInDocumentBin['image'] = true;

    let subscriber = this.appState.selectNodeSubject
      .subscribe(response => this.selectNodeResponse(response));
    this.subscribers.push(subscriber);

    subscriber = this.appState.openBinNodeSubject
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

    subscriber = this.binService.copyNodeSubject
      .subscribe(response => this.pasteNodeResponse(response));
    this.subscribers.push(subscriber);

    subscriber = this.binService.linkMasterclipSubject
      .subscribe(response => this.pasteNodeResponse(response));
    this.subscribers.push(subscriber);

    subscriber = this.binService.cutNodeSubject
      .subscribe(response => this.cutNodeResponse(response));
    this.subscribers.push(subscriber);

    subscriber = this.playerService.createSubclipSubject
      .subscribe(response => this.createSubclipResponse(response));
    this.subscribers.push(subscriber);

    // subscriber = this.binService.getMetadataSubject
    //   .subscribe(response => this.getMetadataResponse(response));
    // this.subscribers.push(subscriber);
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

  private selectItem(item: any, event) {

    if (this.selectedNode != null) {
      this.selectedNode.isSelected = null;
    }

    this.selectedNode = item;
    // this.binService.getMetadata(this.selectedNode);
    this.selectedNode.isSelected = true;
    this.appState.selectNode(item);
  }

  public playClip(node: any) {
    if (node === null) {
      return;
    }

    this.appState.playClip(node);
  }

  public openBin(node: any) {
    if (node === null) {
      return;
    }

    console.log(`Node Type: ${node.type}`);
    if (node.type in this.openable) {
      let tab: BinNode;

      for (let i = 0; i < this.tabs.length; i++) {
        tab = this.tabs[i];
        if (node.id === tab.parent.id) {
          this.selectedIndex = i;
          return;
        }
      }
      this.appState.openBinNode(node);
    }
  }

  private getThumbnail(node: any) {
    if (node.type === 'image') {
      return this.videoHelper.getThumbnailUrl(node, this.appState.selectedMam);
    } else {
      return this.videoHelper.getThumbnailUrl(node, this.appState.selectedMam, node.videoFormat);
    }
  }
  /* *** Page events *** */
  private onPageEvent(event: PageEvent) {
    const tab = this.tabs[this.selectedIndex];
    const skip = event.pageIndex * event.pageSize;
    tab.pageEvent = event;
    this.loading = true;
    if (tab.parent.type === 'searchBin') {
      this.binService.search(tab.parent.name, event.pageSize, skip);
    } else {
      this.binService.getChildren(this.tabs[this.selectedIndex].parent.id, this.tabs[this.selectedIndex].parent.type, event.pageSize, skip);
    }
  }
  /* *** Service Response *** */

  private selectNodeResponse(response: any) {
    if (response instanceof WsMamError || !(response.type in this.openable)) {
      return;
    }

    if (this.tabs[this.selectedIndex] && this.tabs[this.selectedIndex].parent.type === 'searchBin') {
      return;
    }

    for (let i = 0; i < this.tabs.length; i++) {
      const tab = this.tabs[i];
      if (tab.parent.id === response.id) {
        this.selectedIndex = i;
        return;
      }
    }
  }

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
        tab.childCount = response.totalCount;
      
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
      this.snackBar.open(`${this.deletedNode.name} deleted`, null, { duration: 1000 });
      this.tabs[this.selectedIndex].children.splice(index, 1);
      this.tabs[this.selectedIndex].childCount--;
      this.deletedNode = null;
    }

  }

  private pasteNodeResponse(response) {
    this.clipboard.done();

    if (response instanceof WsMamError) {
      return;
    }

    const tab = this.tabs[this.selectedIndex];
    tab.childCount++;
    this.amIVisible(tab, response);
    this.snackBar.open(`${response.name} pasted`, null, { duration: 1000 });
  }

  private cutNodeResponse(response) {
    if (response instanceof WsMamError) {
      this.clipboard.done();
      return;
    }

    const tab = this.tabs[this.selectedIndex];
    tab.childCount++;
    this.amIVisible(tab, response);
    this.snackBar.open(`${response.name} pasted`, null, { duration: 1000 });

    const cuttedClip = this.clipboard.items[0];

    for (let i = 0; i < this.tabs.length; i++) {
      if (this.tabs[i].parent.id === cuttedClip.parent) {
        const index = this.tabs[i].children.indexOf(cuttedClip);

        if (index > -1) {
          this.tabs[i].children.splice(index, 1);
          this.tabs[i].childCount--;
        }
        break;
      }
    }

    this.clipboard.done();
  }

  private createSubclipResponse(response) {

    if (response instanceof WsMamError) {
      return;
    }

    for (let i = 0; i < this.tabs.length; i++) {
      const tab = this.tabs[i];

      if (response.parent === tab.parent.id) {
        tab.childCount++;
        this.selectedIndex = i;
        this.selectTab();
        this.amIVisible(tab, response);
        break;
      }
    }

    this.snackBar.open(`Clip ${response.name} created`, null, { duration: 1000 });
  }

  private amIVisible(tab, response) {
    let skip: boolean;

    if (tab.pageEvent == null) {
      if (this.pageSize >= tab.childCount) {
        skip = false;
      } else {
        skip = true;
      }
    } else {
      if (tab.childCount <= ((tab.pageEvent.pageIndex + 1) * tab.pageEvent.pageSize)) {
        skip = false;
      } else {
        skip = true;
      }
    }

    if (!skip) {
      tab.children.push(response);
    }
  }

  /* *** Dialogs *** */
  private openDeleteNodeDialog(selectedNode: any) {
    const dialogRef = this.dialog.open(WsDeleteDialogComponent, {
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

  private openJDFDialog() {
    const dialogRef = this.dialog.open(WsJdfDialogComponent, {
      width: '500px',
      height: '600px',
      data: this.menuNode
    });
    dialogRef.afterClosed().subscribe(result => {
      if (!result) {
        return;
      }
    });
  }

  /* *** Context Menu *** */
  private contextMenuOpen(selectedNode: any, isChild: boolean) {
    let menuItem: any;

    this.menuNode = selectedNode;
    this.childOpenedMenu = isChild;
    this.contextMenuItems = [];
    const selectedNodeType = this.appState.nodeTypes[selectedNode.type];

    if (isChild) {
      this.selectItem(selectedNode, null);

      if (selectedNode.type in this.playable) {
        menuItem = {
          label: 'Play',
          icon: 'fa-play-circle-o',
          command: (event) => {
            this.playClip(selectedNode);
          }
        };
        this.contextMenuItems.push(menuItem);
        this.contextMenuItems.push({ separator: true });
      }

      if (this.tabs[this.selectedIndex].parent.type !== 'searchBin' && selectedNode.type in this.cutable) {
        menuItem = {
          label: 'Cut',
          icon: 'fa-scissors',
          command: (event) => {
            this.menuSelectedTabIndex = this.selectedIndex;
            this.clipboard.cancel();
            this.clipboard.action = ClipboardAction.Cut;
            this.clipboard.add(selectedNode);
          }
        };
        this.contextMenuItems.push(menuItem);
      }

      if (selectedNode.type in this.copyable) {
        menuItem = {
          label: 'Copy',
          icon: 'fa-files-o',
          command: (event) => {
            this.menuSelectedTabIndex = this.selectedIndex;
            this.clipboard.cancel();
            this.clipboard.action = ClipboardAction.Copy;
            this.clipboard.add(selectedNode);
          }
        };
        this.contextMenuItems.push(menuItem);
      }

      if (this.tabs[this.selectedIndex].parent.type !== 'searchBin' && selectedNodeType.canDelete) {
        menuItem = {
          label: 'Delete',
          icon: 'fa-trash-o',
          command: (event) => {
            this.openDeleteNodeDialog(selectedNode);
          }
        };
        this.contextMenuItems.push(menuItem);
      }

      if (this.childOpenedMenu && selectedNode.type in this.exportable) {
        menuItem = {
          label: 'Send to job drop folder',
          icon: 'fa-indent',
          command: (event) => {
            this.openJDFDialog();
          }
        };
        this.contextMenuItems.push({ separator: true });
        this.contextMenuItems.push(menuItem);
      }
    }

    if (!isChild) {

      for (let i = 0; i < this.tabs.length; i++) {
        if (selectedNode.id === this.tabs[i].parent.id) {
          this.selectedIndex = i;
          break;
        }
      }

      if (this.clipboard.items.length > 0 && selectedNode.type in this.pasteable) {
        if ((selectedNode.type === 'clipBin' && this.clipboard.items[0].type in this.pasteTypesAllowedInClipBin) ||
          (selectedNode.type === 'documentBin' && this.clipboard.items[0].type in this.pasteTypesAllowedInDocumentBin)) {
          menuItem = {
            label: 'Paste to end',
            icon: 'fa-clipboard',
            command: (event) => {
              switch (this.clipboard.items[0].type) {
                case 'masterClip':
                  this.binService.linkMasterclip(this.clipboard.items[0].id, selectedNode.id);
                  break;
                default:
                  if (this.clipboard.action === ClipboardAction.Copy) {
                    this.binService.copyNode(this.clipboard.items[0].id, selectedNode.id);
                  } else if (this.clipboard.action === ClipboardAction.Cut) {
                    this.binService.moveNode(this.clipboard.items[0].id, selectedNode.id);
                  }
                  break;
              }
            }
          };
          this.contextMenuItems.push(menuItem);
          this.contextMenuItems.push({ separator: true });
        }
      }

      if (this.tabs.length > 1) {
        menuItem = {
          label: 'Close Tabs to the right',
          icon: 'fa-times-circle',
          command: (event) => {
            if ((this.tabs.length - 1) > this.selectedIndex) {
              for (let i = this.tabs.length - 1; i > this.selectedIndex; i--) {
                this.closeTab(this.tabs[i]);
              }
            }
          }
        },
          this.contextMenuItems.push(menuItem);
        menuItem = {
          label: 'Close other Tabs',
          icon: 'fa-times-circle',
          command: (event) => {
            for (let i = this.tabs.length - 1; i >= 0; i--) {
              if (this.selectedIndex !== i) {
                this.closeTab(this.tabs[i]);
              }
            }
          }
        },
          this.contextMenuItems.push(menuItem);
        this.contextMenuItems.push({ separator: true });
      }

      if (selectedNode.type !== 'searchBin') {
        menuItem = {
          label: 'Refresh',
          icon: 'fa-refresh',
          command: (event) => {
            this.loading = true;
            const tab = this.tabs[this.selectedIndex];
            if (tab.pageEvent) {
              const skip = tab.pageEvent.pageIndex * tab.pageEvent.pageSize;
              // tslint:disable-next-line:max-line-length
              this.binService.getChildren(selectedNode.id, selectedNode.type, tab.pageEvent.pageSize, skip);
            } else {
              this.binService.getChildren(selectedNode.id, selectedNode.type);
            }
          }
        };
        this.contextMenuItems.push(menuItem);
      }
    }
  }



 
}