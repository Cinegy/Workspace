import {Component, OnInit, OnDestroy} from '@angular/core';
import {ClipboardAction, WsClipboardService} from '../ws-clipboard/ws-clipboard.service';
import {WsCreateBinDialogComponent} from '../ws-dialogs/ws-create-bin-dialog/ws-create-bin-dialog.component';
import {WsMamError} from '../shared/services/ws-base-mam/ws-mam-error';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {WsMainBreadcrumbsService} from '../ws-main/ws-main-breadcrumbs.service';
import {WsAppStateService} from '../ws-app-state.service';
import {WsExplorerService} from './ws-explorer.service';
import {MenuItem} from 'primeng/api';
import {WsCreateFolderDialogComponent} from '../ws-dialogs/ws-create-folder-dialog/ws-create-folder-dialog.component';
import {WsInfoDialogComponent} from '../ws-dialogs/ws-info-dialog/ws-info-dialog.component';
import {WsRenameDialogComponent} from '../ws-dialogs/ws-rename-dialog/ws-rename-dialog.component';
import {WsDeleteDialogComponent} from '../ws-dialogs/ws-delete-dialog/ws-delete-dialog.component';
import {WsJdfDialogComponent} from '../ws-dialogs/ws-jdf-dialog/ws-jdf-dialog.component';

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
  private exportable = {};
  public subscribers: any[];
  public loading = true;
  public selectedNode: any;
  public selectedChildNode: any;
  public childNodes: any[];
  public contextMenuItems: MenuItem[];
  public childOpenedMenu: boolean;
  public displayNewDialog = false;
  public displayDeleteDialog = false;
  public menuNode: any;
  public menuNodeType: any;
  private jdfFolderFound: boolean;
  private canNotRename = {};
  private canNotDelete = {};

  constructor(
    public appState: WsAppStateService,
    private explorerService: WsExplorerService,
    private breadcrumbService: WsMainBreadcrumbsService,
    private clipboard: WsClipboardService,
    public snackBar: MatSnackBar,
    public dialog: MatDialog) {
    this.jdfFolderFound = false;
    this.contextMenuItems = [];
    this.subscribers = [];

    this.notCutable['usersRootFolder'] = true;
    this.notCutable['usersFolder'] = true;
    this.notCutable['jobDropfolderContainer'] = true;
    this.notCutable['jobDropTarget'] = true;
    this.notCutable['jobFolder'] = true;
    this.notCutable['jobServersInfoFolders'] = true;
    this.notCutable['newsFolder'] = true;
    this.notCutable['lib'] = true;
    this.notCutable['usersRootFolder'] = true;
    this.notCutable['usersFolder'] = true;
    this.notCutable['publicSearchQueryFolder'] = true;

    this.canNotRename['jobDropTarget'] = true;
    this.canNotRename['jobFolder'] = true;

    this.canNotDelete['jobDropTarget'] = true;
    this.canNotDelete['jobFolder'] = true;

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
    this.openable['jobDropTarget'] = true;
    this.openable['newsProgram'] = false;
    this.openable['story'] = false;

    this.exportable['clipBin'] = true;
    this.exportable['roll'] = true;
    this.exportable['documentBin'] = true;
    this.exportable['sequence'] = true;

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
    if (this.selectedChildNode != null) {
      this.selectedChildNode.isSelected = null;
    }


    if (node.type == 'newsProgram') {
//      this.appState.showMode = 'news';
    } else if (node.type == 'roll' || node.type == 'clipBin' || node.type == 'documentBin') {
      this.appState.showMode = 'bins';
    } else if (node.type == 'story') {
//      this.appState.showMode = 'story';
    }


    this.selectedChildNode = node;
    this.selectedChildNode.isSelected = true;
    this.appState.selectNode(this.selectedChildNode);
  }

  public selectParent(): void {

    this.appState.selectNode(this.selectedNode);
  }

  public refreshParent(): void {
    this.loading = true;
    this.childNodes = [];
    this.explorerService.getNode(this.selectedNode.id);
  }

  public openNode(node: any): void {
    if (node === null) {
      return;
    }

    const typeGroup = this.appState.nodeTypes[node.type].typeGroup;
    if (this.mainNodeTypes.includes(typeGroup) && node.type !== 'newsProgram') {
      this.loading = true;
      this.selectedNode = node;
      this.breadcrumbService.add(node);
      this.childNodes = [];
      this.explorerService.getNode(this.selectedNode.id);
      this.appState.selectNode(node);
      return;
    }

    if (node.type in this.openable && this.openable[node.type]) {
      if (node.type === 'jobDropTarget') {
        this.appState.openJdfNode(node);
      } else if (node.type === 'newsProgram') {
        this.appState.openNewsNode(node);
      } else if (node.type === 'story') {
        this.appState.openStoryNode(node);
      } else {
        this.appState.openBinNode(node);
      }

      return;
    }

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

    if (!this.jdfFolderFound) {
      for (let i = 0; i < this.childNodes.length; i++) {
        const node = this.childNodes[i];
        if (node.type === 'jobDropfolderContainer') {
          this.appState.jdfRootNode = node;
          this.jdfFolderFound = true;
          break;
        }
      }
    }
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

    this.snackBar.open(`${response.name} created`, null, {duration: 1000});

  }

  private deleteNodeResponse(response: any) {
    if (response instanceof WsMamError) {
      console.log(`Error: ${response.msg}`);
      return;
    }

    const index = this.childNodes.indexOf(this.menuNode);

    if (index > -1) {
      this.snackBar.open(`${this.menuNode.name} deleted`, null, {duration: 1000});
      this.childNodes.splice(index, 1);
//      if (!this.mainNodeTypes.includes(this.menuNodeType.typeGroup)) {
        this.appState.deleteNode(this.menuNode);
//      }
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
      this.snackBar.open(`${response.name} renamed`, null, {duration: 1000});

//      if (!this.mainNodeTypes.includes(this.menuNodeType.typeGroup)) {
        this.appState.updateNode(response);
//      }
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

    this.snackBar.open(`${response.name} pasted`, null, {duration: 1000});
  }

  private cutNodeResponse(response: any) {
    if (response instanceof WsMamError) {
      console.log(`Error: ${response.msg}`);
      this.clipboard.done();
      return;
    }

    const cuttedClip = this.clipboard.items[0];

    const index = this.childNodes.indexOf(cuttedClip);

    if (index > -1) {
      this.childNodes.splice(index, 1);
    }

    this.clipboard.done();

    if (this.childOpenedMenu) {
      this.selectNode(this.menuNode);
    } else {
      this.childNodes.push(response);
    }

    this.snackBar.open(`${response.name} pasted`, null, {duration: 1000});
  }

  /* *** Dialogs *** */

  private openInfoDialog(msg: string) {
    const dialogRef = this.dialog.open(WsInfoDialogComponent, {
      width: '300px',
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
      data: {name: this.menuNode.name, type: this.menuNodeType.type}
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

    if (isChild) {
      this.selectNode(selectedNode);
    }

    if (!this.mainNodeTypes.includes(selectedNodeType.typeGroup)) {
      menuItem = {
        label: 'Open',
        icon: 'fa-window-restore fa',
        command: (event) => {
          this.openNode(selectedNode);
        }
      };

      this.contextMenuItems.push(menuItem);
      this.contextMenuItems.push({separator: true});
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
          icon: 'fa-plus fa',
          items: menuChildItems
        };
        this.contextMenuItems.push(menuItem);
        this.contextMenuItems.push({separator: true});
      }
    }

    if (isChild && !(selectedNode.type in this.notCutable)) {
      menuItem = {
        label: 'Cut',
        icon: 'fa-scissors fa',
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
        icon: 'fa-files-o fa',
        command: (event) => {
          this.clipboard.cancel();
          this.clipboard.action = ClipboardAction.Copy;
          this.clipboard.add(selectedNode);
        }
      };
      this.contextMenuItems.push(menuItem);
    }

    if (this.clipboard.items.length > 0 && selectedNode.type in this.pasteable && this.canInsert(selectedNode, this.clipboard.items[0])) {
      menuItem = {
        label: 'Paste',
        icon: 'fa-clipboard fa',
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

    if (this.childOpenedMenu && selectedNodeType.canDelete && !(selectedNode.type in this.canNotRename)) {
      menuItem = {
        label: 'Rename',
        icon: 'fa-pencil fa',
        command: (event) => {
          this.menuNodeType = this.appState.nodeTypes[selectedNode.type];
          this.renameNodeDialog();
        }
      };
      this.contextMenuItems.push({separator: true});
      this.contextMenuItems.push(menuItem);
    }

    if (this.childOpenedMenu && selectedNodeType.canDelete && !(selectedNode.type in this.canNotDelete)) {
      menuItem = {
        label: 'Delete',
        icon: 'fa-minus fa',
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
        icon: 'fa-refresh fa',
        command: (event) => {
          this.refreshParent();
        }
      };
      this.contextMenuItems.push({separator: true});
      this.contextMenuItems.push(menuItem);
    }

    if (this.childOpenedMenu && selectedNode.type in this.exportable) {
      menuItem = {
        label: 'Send to job drop target',
        icon: 'fa-indent fa',
        command: (event) => {
          this.menuNodeType = this.appState.nodeTypes[selectedNode.type];
          this.openJDFDialog();
        }
      };
      this.contextMenuItems.push({separator: true});
      this.contextMenuItems.push(menuItem);
    }
  }

  private canInsert(parent: any, child: any) {
    if (!parent || !child) {
      return false;
    }
    let selectedNodeType = this.appState.nodeTypes[parent.type];
    if(!selectedNodeType) {
      return false;
    }
    return selectedNodeType.children && selectedNodeType.children.includes(child.type);
  }

  /* *** Breadcrumbs *** */
  private breadcrumbClicked(node: any) {
    this.openNode(node);
  }
}
