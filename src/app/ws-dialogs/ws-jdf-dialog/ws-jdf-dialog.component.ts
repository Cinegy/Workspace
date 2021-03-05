import { Component, OnInit, Inject, OnDestroy, ViewChild } from '@angular/core';
import { WsMamError } from '../../shared/services/ws-base-mam/ws-mam-error';
import { WsJdfBrowseService } from './ws-jdf-browse.service';
import {MatDialogRef, MAT_DIALOG_DATA, MatDialog} from '@angular/material/dialog';
import { WsAppManagementService } from '../../ws-app-management.service';
import { WsAppStateService } from '../../ws-app-state.service';
import { TreeComponent, ITreeOptions, TREE_ACTIONS, KEYS } from 'angular-tree-component';
import {CreateJobParams} from "./create-job-params";


@Component({
  selector: 'app-ws-jdf-dialog',
  templateUrl: './ws-jdf-dialog.component.html',
  styleUrls: ['./ws-jdf-dialog.component.css']
})
export class WsJdfDialogComponent implements OnInit, OnDestroy {
  private jobStates = [];
  public subscribers: any[];
  public nodes: any[];
  public selectedNode: any;
  public infoText = '';
  @ViewChild(TreeComponent)
  private jdfTree: TreeComponent;
  public options: ITreeOptions = {};
  public jobParams = new CreateJobParams()

  constructor(
    public appState: WsAppStateService,
    private management: WsAppManagementService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<WsJdfDialogComponent>,
    private jdfService: WsJdfBrowseService,
  public dialog: MatDialog
  ) {
    this.subscribers = [];
    this.nodes = [];

    let subscriber = this.jdfService.getJobStatesSubject
      .subscribe(response => this.getJobStatesResponse(response));
    this.subscribers.push(subscriber);

    subscriber = this.jdfService.getChildrenSubject
      .subscribe(response => this.getChildrenResponse(response));
    this.subscribers.push(subscriber);

    subscriber = this.jdfService.createJobSubject
      .subscribe(response => this.createJobResponse(response));
    this.subscribers.push(subscriber);

    this.appState.jdfRootNode.hasChildren = true;
    this.selectedNode = this.appState.jdfRootNode;
    this.nodes.push(this.selectedNode);
  }

  ngOnInit() {
    this.jdfService.getJobStates();
    this.jobParams.name = this.data.name;
  }

  ngOnDestroy() {
    this.subscribers.forEach(element => {
      element.unsubscribe();
    });
  }

  private getJobStatesResponse(response: any) {
    if (response instanceof WsMamError) {
      console.log(`Error: ${response.msg}`);
      return;
    }

    this.jobStates = response;
  }

  private getChildrenResponse(nodes: any) {
    if (nodes instanceof WsMamError) {
      console.log(`Error: ${nodes.msg}`);
      return;
    }
    this.selectedNode.children = nodes.items;

    this.selectedNode.children.forEach(node => {
      if (node.type === 'jobDropTarget') {
        node.hasChildren = false;
      } else {
        node.hasChildren = true;
      }
    });
    this.jdfTree.treeModel.update();
  }

  private createJobResponse(response: any) {
    if (response instanceof WsMamError) {
      console.log(`Error: ${response.msg}`);
      this.infoText = `Error: ${response.msg}`;
      return;
    }

    this.infoText = 'Success';
    this.appState.openJdfNode(this.selectedNode);
    this.dialogRef.close();
  }

  public onActivate(event) {
    this.selectedNode = event.node.data;

    if (this.selectedNode.hasChildren) {

      this.jdfService.getChildren(this.selectedNode.id);

    }
  }

  public createJob() {
    const jobStates = this.jobStates.filter(state => {
      return state.name === 'Queued';
    });

    if (jobStates && jobStates.length > 0) {
      this.infoText = 'Creating Job... ';
      this.jdfService.createJob(this.selectedNode.id, this.data, jobStates[0], this.jobParams);
      return;
    }
  }

}
