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
  public selectedNode: any;

  constructor(
    public appState: WsAppStateService,
    public management: WsAppManagementService) {
    this.subscribers = [];

    const subscriber = this.appState.openNodeSubject
      .subscribe(response => this.openNodeResponse(response));
    this.subscribers.push(subscriber);

  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.subscribers.forEach(element => {
      element.unsubscribe();
    });
  }

  private openNodeResponse(response: any) {
    if (response instanceof WsMamError) {
      return;
    }

    this.selectedNode = response;
  }
}
