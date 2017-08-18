import { WsAppStateService } from './../ws-app-state.service';
import { WsMainBreadcrumbsService } from './../ws-main/ws-main-breadcrumbs.service';
import { WsMamError } from './../shared/services/ws-base-mam/ws-mam-error';
import { WsExplorerService } from './ws-explorer.service';
import { Component, OnInit, HostBinding, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-ws-explorer',
  templateUrl: './ws-explorer.component.html',
  styleUrls: ['./ws-explorer.component.css']
})
export class WsExplorerComponent implements OnInit, OnDestroy {
  public subscribers: any[];
  public loading = true;
  public selectedNode: any;
  public childNodes: any[];

  constructor(
    public appState: WsAppStateService,
    private explorerService: WsExplorerService,
    private breadcrumbService: WsMainBreadcrumbsService) {
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

  public selectNode(node: any) {
    this.loading = true;
    this.selectedNode = node;
    this.breadcrumbService.add(node);
    this.explorerService.getNode(this.selectedNode.id);
  }

  private getRootResponse(response: any) {
    this.loading = false;

    if (response instanceof WsMamError) {
      console.log(`Error: ${response.msg}`);
    }

    this.selectedNode = response;
    this.breadcrumbService.add(this.selectedNode);
    console.log(`Get Root: ${this.selectedNode.name}`);
    this.loading = true;
    this.explorerService.getChildren(this.selectedNode.list.url);
  }

  private getNodeResponse(response: any) {
    this.loading = false;

    if (response instanceof WsMamError) {
      console.log(`Error: ${response.msg}`);
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
    }

    this.childNodes = response.items;
    console.log(`Get Children: ${this.childNodes.length}`);
  }

  private breadcrumbClicked(node: any) {
    this.selectNode(node);
  }

}
