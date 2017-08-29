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
  public selectedNode: any;

  constructor(
    public appState: WsAppStateService,
    public management: WsAppManagementService) {
    this.subscribers = [];

    const subscriber = this.appState.selectNodeSubject
      .subscribe(response => this.selectedNodeResponse(response));
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
  }

}
