import { Component, OnInit } from '@angular/core';
import { WsMainBreadcrumbsService } from './ws-main-breadcrumbs.service';
import { WsAppStateService } from '../ws-app-state.service';

@Component({
  selector: 'app-ws-main',
  templateUrl: './ws-main.component.html',
  styleUrls: ['./ws-main.component.css']
})
export class WsMainComponent implements OnInit {
  public showMode:string;
  public isImport:boolean;

  constructor(
    public breadcrumbService:WsMainBreadcrumbsService,
    public appState: WsAppStateService
    ) { 
      this.showMode = appState.showMode;
      this.isImport = (this.appState.selectedMam.uploadStores != undefined);
    }

  ngOnInit() {
    this.breadcrumbService.reset();
  }

}
