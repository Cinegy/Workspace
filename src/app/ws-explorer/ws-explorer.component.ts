import { WsClipboardService, ClipboardAction } from './../ws-clipboard/ws-clipboard.service';
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
import { MatDialog, MatSnackBar } from '@angular/material';
import { DragulaService } from 'ng2-dragula';

@Component({
  selector: 'app-ws-explorer',
  templateUrl: './ws-explorer.component.html',
  styleUrls: ['./ws-explorer.component.css']
})
export class WsExplorerComponent implements OnInit, OnDestroy {
  private readonly mainNodeTypes = ['dbRoot', 'folderGeneric', 'lib'];
  private notCutable = {};
  private copyable = {};
  private pasteable = {};
  private openable = {};
  public subscribers: any[];
  public loading = true;
  public selectedNode: any;
  public childNodes: any[];
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
    private clipboard: WsClipboardService,
    // private dragulaService: DragulaService,
    public snackBar: MatSnackBar,
    public dialog: MatDialog) {

    this.contextMenuItems = [];
    this.subscribers = [];

    this.notCutable['usersRootFolder'] = true;
    this.notCutable['usersFolder'] = true;
    this.notCutable['jobDropfolderContainer'] = true;
    this.notCutable['jobServersInfoFolders'] = true;
    this.notCutable['newsFolder'] = true;
    this.notCutable['lib'] = true;
    this.notCutable['usersRootFolder'] = true;
    this.notCutable['usersFolder'] = true;
    this.notCutable['publicSearchQueryFolder'] = true;

    this.copyable['clipBin'] = true;

    this.pasteable['libraryFolder'] = true;
    this.pasteable['folder'] = true;
    this.pasteable['portfolio'] = true;
    this.pasteable['production'] = true;
    this.pasteable['programme'] = true;
    this.pasteable['programmeVersion'] = true;

    this.openable['clipBin'] = true;
    this.openable['documentBin'] = true;
    this.openable['roll'] = true;
    this.openable['placeholderMog'] = true;

    // dragulaService.setOptions('explorer-bag', {
    //   revertOnSpill: true
    // });

    // let subscriber = dragulaService.drag.subscribe((value) => {
    //   this.onDrag(value);
    // });
    // this.subscribers.push(subscriber);

    // subscriber = dragulaService.drop.subscribe((value) => {
    //   this.onDrop(value);
    // });
    // this.subscribers.push(subscriber);

    // subscriber = dragulaService.dropModel.subscribe((value) => {
    //   this.onDropModel(value);
    // });
    // this.subscribers.push(subscriber);

    // subscriber = dragulaService.over.subscribe((value) => {
    //   this.onOver(value);
    // });
    // this.subscribers.push(subscriber);

    // subscriber = dragulaService.out.subscribe((value) => {
    //   this.onOut(value);
    // });
    // this.subscribers.push(subscriber);

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

  public selectParent() {
    this.appState.selectNode(this.selectedNode);
  }

  public refreshParent() {
    this.loading = true;
    this.childNodes = [];
    this.explorerService.getNode(this.selectedNode.id);
  }

  public openNode(node: any) {
    if (node === null) {
      return;
    }

    if (!(node.type in this.openable)) {
      return;
    }

    this.appState.openNode(node);
  }

  /* *** Service responses *** */
  private getRootResponse(response: any) {
    this.loading = false;

    if (response instanceof WsMamError) {
      console.log(`Error: ${response.msg}`);
      return;
    }

    this.selectedNode = response;
    this.appState.selectNode(this.selectedNode);
    this.breadcrumbService.add(this.selectedNode);
    console.log(`Get Root: ${this.selectedNode.name}`);
    this.loading = true;
    this.explorerService.getChildren(this.selectedNode.id);
  }

  private getNodeResponse(response: any) {
    this.loading = false;

    if (response instanceof WsMamError) {
      console.log(`Error: ${response.msg}`);
      return;
    }

    this.selectedNode = response;
    console.log(`Get Node: ${this.selectedNode.name}`);
    this.loading = true;
    this.explorerService.getChildren(this.selectedNode.id);
  }

  private getChildrenResponse(response: any) {
    this.loading = false;

    if (response instanceof WsMamError) {
      console.log(`Error: ${response.msg}`);
      return;
    }

    this.childNodes = response.items;
    console.log(`Get Children: ${this.childNodes.length}`);
  }

  private createNodeResponse(response: any) {
    if (response instanceof WsMamError) {
      console.log(`Error: ${response.msg}`);
      return;
    }

    if (this.childOpenedMenu) {
      this.selectNode(this.menuNode);
    } else {
      this.childNodes.push(response);
    }

    this.snackBar.open(`${response.name} created`, null, { duration: 1000 });

  }

  private deleteNodeResponse(response: any) {
    if (response instanceof WsMamError) {
      console.log(`Error: ${response.msg}`);
      return;
    }

    const index = this.childNodes.indexOf(this.menuNode);

    if (index > -1) {
      this.snackBar.open(`${this.menuNode.name} deleted`, null, { duration: 1000 });
      this.childNodes.splice(index, 1);
      if (!this.mainNodeTypes.includes(this.menuNodeType.typeGroup)) {
        this.appState.deleteNode(this.menuNode);
      }
    }
  }

  private renameNodeResponse(response: any) {
    if (response instanceof WsMamError) {
      console.log(`Error: ${response.msg}`);
      return;
    }

    const index = this.childNodes.indexOf(this.menuNode);

    if (index > -1) {
      this.childNodes[index] = response;
      this.snackBar.open(`${response.name} renamed`, null, { duration: 1000 });

      if (!this.mainNodeTypes.includes(this.menuNodeType.typeGroup)) {
        this.appState.updateNode(response);
      }
    }
  }

  private copyNodeResponse(response: any) {
    this.clipboard.done();

    if (response instanceof WsMamError) {
      console.log(`Error: ${response.msg}`);
      return;
    }

    if (this.childOpenedMenu) {
      this.selectNode(this.menuNode);
    } else {
      this.childNodes.push(response);
    }

    this.snackBar.open(`${response.name} pasted`, null, { duration: 1000 });
  }

  private cutNodeResponse(response: any) {
    if (response instanceof WsMamError) {
      console.log(`Error: ${response.msg}`);
      this.clipboard.done();
      return;
    }

    const cuttedClip = this.clipboard.items[0];

    if (cuttedClip.parent === response.parent) {
      const index = this.childNodes.indexOf(cuttedClip);

      if (index > -1) {
        this.childNodes.splice(index, 1);
      }
    }

    this.clipboard.done();

    if (this.childOpenedMenu) {
      this.selectNode(this.menuNode);
    } else {
      this.childNodes.push(response);
    }

    this.snackBar.open(`${response.name} pasted`, null, { duration: 1000 });
  }

  /* *** Dragula *** */
  private onDrag(args) {
  }

  private onDrop(args) {
  }

  private onDropModel(args) {
  }

  private onOver(args) {
  }

  private onOut(args) {
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

    this.menuNode = selectedNode;
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
      this.contextMenuItems.push({ separator: true });
    }

    if (this.mainNodeTypes.includes(selectedNodeType.typeGroup) && selectedNodeType.children) {
      selectedNodeType.children.forEach(item => {
        if (this.appState.nodeTypes[item].canCreate) {
          menuChildItem = {
            label: this.appState.nodeTypes[item].name,
            command: (event) => {
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
        this.contextMenuItems.push({ separator: true });
      }
    }

    if (isChild && !(selectedNode.type in this.notCutable)) {
      menuItem = {
        label: 'Cut',
        icon: 'fa-scissors',
        command: (event) => {
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
          this.clipboard.cancel();
          this.clipboard.action = ClipboardAction.Copy;
          this.clipboard.add(selectedNode);
        }
      };
      this.contextMenuItems.push(menuItem);
    }

    if (this.clipboard.items.length > 0 && selectedNode.type in this.pasteable) {
      menuItem = {
        label: 'Paste',
        icon: 'fa-clipboard',
        command: (event) => {
          if (this.clipboard.action === ClipboardAction.Copy) {
            this.explorerService.copyNode(this.clipboard.items[0].id, selectedNode.id);
          } else if (this.clipboard.action === ClipboardAction.Cut) {
            this.explorerService.moveNode(this.clipboard.items[0].id, selectedNode.id);
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
          this.menuNodeType = this.appState.nodeTypes[selectedNode.type];
          this.renameNodeDialog();
        }
      };
      this.contextMenuItems.push({ separator: true });
      this.contextMenuItems.push(menuItem);
    }

    if (this.childOpenedMenu && selectedNodeType.canDelete) {
      menuItem = {
        label: 'Delete',
        icon: 'fa-minus',
        command: (event) => {
          this.menuNodeType = this.appState.nodeTypes[selectedNode.type];
          this.openDeleteNodeDialog();
        }
      };
      this.contextMenuItems.push(menuItem);
    }

    if (!this.childOpenedMenu) {
      menuItem = {
        label: 'Refresh',
        icon: 'fa-refresh',
        command: (event) => {
          this.refreshParent();
        }
      };
      this.contextMenuItems.push({ separator: true });
      this.contextMenuItems.push(menuItem);
    }
  }

  /* *** Breadcrumbs *** */
  private breadcrumbClicked(node: any) {
    this.selectNode(node);
  }
}
