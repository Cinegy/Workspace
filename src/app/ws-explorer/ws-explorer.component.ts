import { ClipboardItem, ClipboardAction } from './../ws-bins/clipboard-item';
import { WsCreateBinDialogComponent } from './../ws-dialogs/ws-create-bin-dialog/ws-create-bin-dialog.component';
import { WsErrorDialogComponent } from './../ws-dialogs/ws-error-dialog/ws-error-dialog.component';
import { WsRenameDialogComponent } from './../ws-dialogs/ws-rename-dialog/ws-rename-dialog.component';
import { WsDeleteDialogComponent } from './../ws-dialogs/ws-delete-dialog/ws-delete-dialog.component';
import { WsInfoDialogComponent } from './../ws-dialogs/ws-info-dialog/ws-info-dialog.component';
import { WsCreateFolderDialogComponent } from './../ws-dialogs/ws-create-folder-dialog/ws-create-folder-dialog.component';
import { WsAppManagementService } from './../ws-app-management.service';
import { MenuItem, ConfirmationService } from 'primeng/primeng';
import { WsAppStateService } from './../ws-app-state.service';
import { WsMainBreadcrumbsService } from './../ws-main/ws-main-breadcrumbs.service';
import { WsMamError } from './../shared/services/ws-base-mam/ws-mam-error';
import { WsExplorerService } from './ws-explorer.service';
import { Component, OnInit, HostBinding, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-ws-explorer',
  templateUrl: './ws-explorer.component.html',
  styleUrls: ['./ws-explorer.component.css']
})
export class WsExplorerComponent implements OnInit, OnDestroy {
  private readonly mainNodeTypes = ['dbRoot', 'folderGeneric', 'lib'];
  private internalClipboardItem: ClipboardItem = null;
  public subscribers: any[];
  public loading = true;
  public selectedNode: any;
  public childNodes: any[];
  public childCount = 0;
  public contextMenuItems: MenuItem[];
  public childOpenedMenu: boolean;
  public displayNewDialog = false;
  public displayDeleteDialog = false;
  public menuNode: any;
  public menuNodeType: any;

  constructor(
    public appState: WsAppStateService,
    private explorerService: WsExplorerService,
    private breadcrumbService: WsMainBreadcrumbsService,
    public dialog: MatDialog) {

    this.contextMenuItems = [];
    this.subscribers = [];

    let subscriber = this.explorerService.getRootSubject
      .subscribe(response => this.getRootResponse(response));
    this.subscribers.push(subscriber);

    subscriber = this.explorerService.getNodeSubject
      .subscribe(response => this.getNodeResponse(response));
    this.subscribers.push(subscriber);

    subscriber = this.explorerService.getChildrenSubject
      .subscribe(response => this.getChildrenResponse(response));
    this.subscribers.push(subscriber);

    subscriber = this.explorerService.createNodeSubject
      .subscribe(response => this.createNodeResponse(response));
    this.subscribers.push(subscriber);

    subscriber = this.explorerService.createDocumentBinSubject
      .subscribe(response => this.createNodeResponse(response));
    this.subscribers.push(subscriber);

    subscriber = this.explorerService.createClipBinSubject
      .subscribe(response => this.createNodeResponse(response));
    this.subscribers.push(subscriber);

    subscriber = this.explorerService.deleteNodeSubject
      .subscribe(response => this.deleteNodeResponse(response));
    this.subscribers.push(subscriber);

    subscriber = this.explorerService.renameNodeSubject
      .subscribe(response => this.renameNodeResponse(response));
    this.subscribers.push(subscriber);

    subscriber = this.explorerService.copyNodeSubject
      .subscribe(response => this.copyNodeResponse(response));
    this.subscribers.push(subscriber);

    subscriber = this.explorerService.cutNodeSubject
      .subscribe(response => this.cutNodeResponse(response));
    this.subscribers.push(subscriber);

    subscriber = this.breadcrumbService.breadcrumbClickedSubject
      .subscribe(node => this.breadcrumbClicked(node));
    this.subscribers.push(subscriber);
  }

  ngOnInit() {
    this.loading = true;
    this.explorerService.getRoot();
  }

  ngOnDestroy() {
    this.subscribers.forEach(element => {
      element.unsubscribe();
    });
  }

  /* *** Public *** */

  public selectNode(node: any) {
    const typeGroup = this.appState.nodeTypes[node.type].typeGroup;

    console.log(`Select Node: ${node.type}, ${typeGroup}`);

    if (this.mainNodeTypes.includes(typeGroup)) {
      this.loading = true;
      this.selectedNode = node;
      this.breadcrumbService.add(node);
      this.childNodes = [];
      this.explorerService.getNode(this.selectedNode.id);
    }

    this.appState.selectNode(node);
  }

  public openNode(node: any) {
    if (node === null) {
      return;
    }

    this.appState.openNode(node);
    console.log(`Opening Node: ${node.name}`);
  }

  /* *** Service responses *** */
  private getRootResponse(response: any) {
    this.loading = false;

    if (response instanceof WsMamError) {
      console.log(`Error: ${response.msg}`);
      this.openErrorDialog(response.msg);
      return;
    }

    this.selectedNode = response;
    this.appState.selectNode(this.selectedNode);
    this.breadcrumbService.add(this.selectedNode);
    console.log(`Get Root: ${this.selectedNode.name}`);
    this.loading = true;
    this.explorerService.getChildren(this.selectedNode.list.url);
  }

  private getNodeResponse(response: any) {
    this.loading = false;

    if (response instanceof WsMamError) {
      console.log(`Error: ${response.msg}`);
      this.openErrorDialog(response.msg);
      return;
    }

    this.selectedNode = response;
    console.log(`Get Node: ${this.selectedNode.name}`);
    this.loading = true;
    this.explorerService.getChildren(this.selectedNode.list.url);
  }

  private getChildrenResponse(response: any) {
    this.loading = false;

    if (response instanceof WsMamError) {
      console.log(`Error: ${response.msg}`);
      this.openErrorDialog(response.msg);
      return;
    }

    this.childNodes = response.items;
    this.childCount = response.totalCount;
    console.log(`Get Children: ${this.childNodes.length}`);
  }

  private createNodeResponse(response: any) {
    if (response instanceof WsMamError) {
      console.log(`Error: ${response.msg}`);
      this.openErrorDialog(response.msg);
      return;
    }

    if (this.childOpenedMenu) {
      this.selectNode(this.menuNode);
    } else {
      this.childNodes.push(response);
    }

  }

  private deleteNodeResponse(response: any) {
    if (response instanceof WsMamError) {
      console.log(`Error: ${response.msg}`);
      this.openErrorDialog(response.msg);
      return;
    }

    const index = this.childNodes.indexOf(this.menuNode);

    if (index > -1) {
      this.childNodes.splice(index, 1);
      if (!this.mainNodeTypes.includes(this.menuNodeType.typeGroup)) {
        this.appState.deleteNode(this.menuNode);
      }
    }
  }

  private renameNodeResponse(response: any) {
    if (response instanceof WsMamError) {
      console.log(`Error: ${response.msg}`);
      this.openErrorDialog(response.msg);
      return;
    }

    const index = this.childNodes.indexOf(this.menuNode);

    if (index > -1) {
      this.childNodes[index] = response;

      if (!this.mainNodeTypes.includes(this.menuNodeType.typeGroup)) {
        this.appState.updateNode(response);
      }
    }
  }

  private copyNodeResponse(response: any) {
    if (response instanceof WsMamError) {
      console.log(`Error: ${response.msg}`);
      this.openErrorDialog(response.msg);
      return;
    }

    if (this.childOpenedMenu) {
      this.selectNode(this.menuNode);
    } else {
      this.childNodes.push(response);
    }
  }

  private cutNodeResponse(response: any) {
    if (response instanceof WsMamError) {
      console.log(`Error: ${response.msg}`);
      this.openErrorDialog(response.msg);
      return;
    }

    if (this.childOpenedMenu) {
      this.selectNode(this.menuNode);
    } else {
      this.childNodes.push(response);
    }
  }

  /* *** Dialogs *** */

  private openInfoDialog(msg: string) {
    const dialogRef = this.dialog.open(WsInfoDialogComponent, {
      width: '300px',
      data: msg
    });
  }

  private openErrorDialog(msg: string) {
    const dialogRef = this.dialog.open(WsErrorDialogComponent, {
      width: '600px',
      data: msg
    });
  }

  private openNewFolderDialog() {
    const dialogRef = this.dialog.open(WsCreateFolderDialogComponent, {
      width: '400px',
      data: this.menuNodeType
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result == null) {
        return;
      }

      console.log(`Create Node`);
      this.explorerService.createNode(this.menuNode.id, this.menuNodeType.type, result);
    });
  }

  private openNewDocumentBinDialog() {
    const dialogRef = this.dialog.open(WsCreateBinDialogComponent, {
      width: '400px',
      data: this.menuNodeType
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result == null) {
        return;
      }

      console.log(`Create Document Bin`);
      this.explorerService.createDocumentBin(this.menuNode.id, result);
    });
  }

  private openNewClipBinDialog() {
    const dialogRef = this.dialog.open(WsCreateBinDialogComponent, {
      width: '400px',
      data: this.menuNodeType
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result == null) {
        return;
      }

      console.log(`Create Clip Bin`);
      this.explorerService.createClipBin(this.menuNode.id, result);
    });
  }

  private renameNodeDialog() {
    const dialogRef = this.dialog.open(WsRenameDialogComponent, {
      width: '400px',
      data: { name: this.menuNode.name, type: this.menuNodeType.type }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result == null) {
        return;
      }

      console.log(`Rename Node`);
      this.explorerService.renameNode(this.menuNode.id, result);
    });
  }

  private openDeleteNodeDialog() {
    const dialogRef = this.dialog.open(WsDeleteDialogComponent, {
      width: '400px',
      data: this.menuNode.name
    });
    dialogRef.afterClosed().subscribe(result => {
      if (!result) {
        return;
      }

      console.log(`Delete Node`);
      this.explorerService.deleteNode(this.menuNode.id);
    });
  }

  /* *** Conetxt Menu *** */

  private contextMenuOpen(selectedNode: any, isChild: boolean) {
    let menuItem: any;
    let menuChildItems: any;
    let menuChildItem: any;

    this.childOpenedMenu = isChild;
    this.contextMenuItems = [];
    menuChildItems = [];
    const selectedNodeType = this.appState.nodeTypes[selectedNode.type];
    const typeGroup = this.appState.nodeTypes[selectedNode.type].typeGroup;

    if (!this.mainNodeTypes.includes(selectedNodeType.typeGroup)) {
      menuItem = {
        label: 'Open',
        icon: 'fa-window-restore',
        command: (event) => {
          this.openNode(selectedNode);
        }
      };

      this.contextMenuItems.push(menuItem);
    }

    if (this.mainNodeTypes.includes(selectedNodeType.typeGroup) && selectedNodeType.children) {
      selectedNodeType.children.forEach(item => {
        if (this.appState.nodeTypes[item].canCreate) {
          menuChildItem = {
            label: this.appState.nodeTypes[item].name,
            command: (event) => {
              this.menuNode = selectedNode;
              this.menuNodeType = this.appState.nodeTypes[item];

              switch (this.menuNodeType.typeGroup) {
                case 'folderGeneric':
                  this.openNewFolderDialog();
                  break;
                case 'documentBin':
                  this.openNewDocumentBinDialog();
                  break;
                case 'clipBin':
                  this.openNewClipBinDialog();
                  break;
                default:
                  this.openInfoDialog('Not Implemented');
                  break;
              }
            }
          };
          menuChildItems.push(menuChildItem);
        }
      });

      if (menuChildItems.length > 0) {
        menuItem = {
          label: 'New',
          icon: 'fa-plus',
          items: menuChildItems
        };
        this.contextMenuItems.push(menuItem);
      }
    }

    const notCutable = {};
    notCutable['usersRootFolder'] = true;
    notCutable['usersFolder'] = true;
    notCutable['jobDropfolderContainer'] = true;
    notCutable['jobServersInfoFolders'] = true;
    notCutable['newsFolder'] = true;
    notCutable['lib'] = true;
    notCutable['usersRootFolder'] = true;
    notCutable['usersFolder'] = true;
    notCutable['publicSearchQueryFolder'] = true;

    if (selectedNode.type in notCutable) {
      menuItem = {
        label: 'Cut',
        icon: 'fa-scissors',
        disabled: true
      };
    } else {
      menuItem = {
        label: 'Cut',
        icon: 'fa-scissors',
        command: (event) => {
          this.internalClipboardItem = new ClipboardItem();
          this.internalClipboardItem.action = ClipboardAction.Cut;
          this.internalClipboardItem.item = selectedNode;
        }
      };
    }
    this.contextMenuItems.push(menuItem);

    const copyable = {};
    copyable['roll'] = true;
    copyable['clipBin'] = true;

    if (selectedNode.type in copyable) {
      menuItem = {
        label: 'Copy',
        icon: 'fa-files-o',
        command: (event) => {
          this.internalClipboardItem = new ClipboardItem();
          this.internalClipboardItem.action = ClipboardAction.Copy;
          this.internalClipboardItem.item = selectedNode;
        }
      };
      this.contextMenuItems.push(menuItem);
    }

    const pasteable = {};
    pasteable['libraryFolder'] = true;
    pasteable['folder'] = true;
    pasteable['portfolio'] = true;
    pasteable['production'] = true;
    pasteable['programme'] = true;
    pasteable['programmeVersion'] = true;

    if (selectedNode.type in pasteable) {
      menuItem = {
        label: 'Paste',
        icon: 'fa-clipboard',
        command: (event) => {
          if (this.internalClipboardItem.action === ClipboardAction.Copy) {
            this.explorerService.copyNode(this.internalClipboardItem.item.id, selectedNode.id);
            this.internalClipboardItem = null;
          } else if (this.internalClipboardItem.action === ClipboardAction.Cut) {
            this.explorerService.cutNode(this.internalClipboardItem.item.id, selectedNode.id);
          }
        }
      };
      this.contextMenuItems.push(menuItem);
    }

    if (this.childOpenedMenu && selectedNodeType.canDelete) {
      menuItem = {
        label: 'Rename',
        icon: 'fa-pencil',
        command: (event) => {
          this.menuNode = selectedNode;
          this.menuNodeType = this.appState.nodeTypes[selectedNode.type];
          this.renameNodeDialog();
        }
      };
      this.contextMenuItems.push(menuItem);
    }

    if (this.childOpenedMenu && selectedNodeType.canDelete) {
      menuItem = {
        label: 'Delete',
        icon: 'fa-minus',
        command: (event) => {
          this.menuNode = selectedNode;
          this.menuNodeType = this.appState.nodeTypes[selectedNode.type];
          this.openDeleteNodeDialog();
        }
      };
      this.contextMenuItems.push(menuItem);
    }
  }

  /* *** Breadcrumbs *** */
  private breadcrumbClicked(node: any) {
    this.selectNode(node);
  }
}
