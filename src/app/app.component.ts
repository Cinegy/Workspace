import { WsMamError } from './shared/services/ws-base-mam/ws-mam-error';
import { Router } from '@angular/router';
import { WsLoginService } from './ws-login/ws-login.service';
import { WsAppStateService } from './ws-app-state.service';
import { WsAppManagementService } from './ws-app-management.service';
import { Observable } from 'rxjs/Observable';
import { WsConfigurationService } from './ws-configuration/ws-configuration.service';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  private subscribers: any[];

  constructor(
    private appState: WsAppStateService,
    private management: WsAppManagementService,
    private router: Router) {
    this.subscribers = [];
  }

  public ngOnInit() {
    console.log('*** Application started ***');

    let subscriber = this.appState.loggedInSubject
      .subscribe(response => this.loginResponse(response));
    this.subscribers.push(subscriber);

    subscriber = this.management.getNodeTypesSubject
      .subscribe(nodeTypes => this.getNodeTypesResponse(nodeTypes));
    this.subscribers.push(subscriber);

    subscriber = this.management.getIconsSubject
      .subscribe(icons => this.getIconsResponse(icons));
    this.subscribers.push(subscriber);

    subscriber = this.management.getDescriptorsSubject
      .subscribe(response => this.getDescriptorsResponse(response));
    this.subscribers.push(subscriber);
  }

  ngOnDestroy() {
    this.subscribers.forEach(element => {
      element.unsubscribe();
    });
  }

  private loginResponse(response: any) {
    this.management.initialize();
    this.router.navigate(['/main']);
      // { outlets: {
      //   'routeLeftContainer': ['explorer'],
      //   'routeCenterContainer': ['bins']
      // }}]);
  }

  private getNodeTypesResponse(nodeTypes: any) {
    if (nodeTypes instanceof WsMamError) {
      console.log(`Error: ${nodeTypes.msg}`);
      return;
    }

    nodeTypes.forEach(nodeType => {
      this.appState.nodeTypes[nodeType.type] = nodeType;
      // this.management.getDescriptors(nodeType.type);
    });
  }

  private getIconsResponse(icons: any) {
    if (icons instanceof WsMamError) {
      console.log(`Error: ${icons.msg}`);
      return;
    }

    icons.forEach(icon => {
      this.appState.nodeIcons[icon.type] = icon;
    });
  }

  private getDescriptorsResponse(response: any) {
    if (response instanceof WsMamError) {
      // console.log(`Error for ${response.extMsg}: ${response.msg}`);
      return;
    }

    this.appState.descriptors[response.extra] = response.payload;
  }
}
