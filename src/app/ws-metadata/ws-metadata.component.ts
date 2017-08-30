import { WsMetadataService } from './ws-metadata.service';
import { WsMamError } from './../shared/services/ws-base-mam/ws-mam-error';
import { WsAppManagementService } from './../ws-app-management.service';
import { WsAppStateService } from './../ws-app-state.service';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-ws-metadata',
  templateUrl: './ws-metadata.component.html',
  styleUrls: ['./ws-metadata.component.css']
})
export class WsMetadataComponent implements OnInit, OnDestroy {
  public subscribers: any[];
  public descriptorGroups: any[];
  public descriptors: any[];
  public selectedNode: any;

  constructor(
    public appState: WsAppStateService,
    public management: WsAppManagementService,
    private metadataService: WsMetadataService) {
    this.subscribers = [];

    let subscriber = this.appState.selectNodeSubject
      .subscribe(response => this.selectedNodeResponse(response));
    this.subscribers.push(subscriber);

    subscriber = this.appState.deleteNodeSubject
      .subscribe(response => this.nodeDeletedResponse(response));
    this.subscribers.push(subscriber);

    subscriber = this.appState.updateNodeSubject
      .subscribe(response => this.nodeUpdatedResponse(response));
    this.subscribers.push(subscriber);

    subscriber = this.metadataService.getDescriptorsSubject
      .subscribe(response => this.getDescriptorsResponse(response));
    this.subscribers.push(subscriber);

    subscriber = this.metadataService.getMetadataSubject
      .subscribe(response => this.getMetadataResponse(response));
    this.subscribers.push(subscriber);
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.subscribers.forEach(element => {
      element.unsubscribe();
    });
  }

  private selectedNodeResponse(response: any) {
    if (response instanceof WsMamError) {
      return;
    }

    this.selectedNode = response;
    this.descriptorGroups = [];
    this.descriptors = this.appState.descriptors[this.selectedNode.type];

    if (this.descriptors === undefined) {
      this.metadataService.getDescriptors(this.selectedNode.type);
    } else {
      this.metadataService.getMetadata(this.selectedNode.id);
    }
  }

  private getDescriptorsResponse(response) {
    if (response instanceof WsMamError) {
      return;
    }

    this.descriptors = response;
    this.metadataService.getMetadata(this.selectedNode.id);
  }

  private getMetadataResponse(response) {
    if (response instanceof WsMamError) {
      return;
    }

    this.sortDescriptors(this.descriptors, response.items);
  }

  private nodeDeletedResponse(response) {
    if (response instanceof WsMamError) {
      return;
    }

    if (response.id !== this.selectedNode.id) {
      return;
    }

    this.descriptors = [];
    this.descriptorGroups = [];
    this.selectedNode = null;
  }

  private nodeUpdatedResponse(response) {
    if (response instanceof WsMamError) {
      return;
    }

    if (response.id !== this.selectedNode.id) {
      return;
    }

    this.selectedNode = response;
  }

  private sortDescriptors(descriptors, metadata) {
    const tmpGroups = {};

    for (const descriptor of descriptors) {
      descriptor.value = {name: null, value: null};
      const group = tmpGroups[descriptor.group.id];

      for (let i = 0; i < metadata.length; i++) {
        const item = metadata[i];

        if (item.descriptorId === descriptor.id && item.value) {
          descriptor.value = item.value;
          break;
        }
      }

      if (group === undefined) {
        tmpGroups[descriptor.group.id] = [];
        tmpGroups[descriptor.group.id].push(descriptor);
      } else {
        tmpGroups[descriptor.group.id].push(descriptor);
      }
    }

    // tslint:disable-next-line:forin
    for (const key in tmpGroups) {
      const value = tmpGroups[key];
      this.descriptorGroups.push(value);
    }
  }

}
