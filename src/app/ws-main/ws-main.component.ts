import {AfterContentInit, AfterViewChecked, AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import { WsMainBreadcrumbsService } from './ws-main-breadcrumbs.service';
import { WsAppStateService } from '../ws-app-state.service';
import { SplitComponent, SplitAreaDirective } from 'angular-split';

@Component({
  selector: 'app-ws-main',
  templateUrl: './ws-main.component.html',
  styleUrls: ['./ws-main.component.scss']
})
export class WsMainComponent implements OnInit, AfterContentInit, AfterViewChecked, AfterViewInit {
  @ViewChild('playerSplitArea', {static: true}) playerSplitArea: any;

  public showMode:string;
  public isImport:boolean;
  private playerAreaHeight: number;

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

  areaChanged(event) {
    this.playerAreaHeight = this.playerSplitArea.nativeElement.clientHeight;
  }

  ngAfterContentInit(): void {
    this.playerAreaHeight = this.playerSplitArea.nativeElement.clientHeight;
  }

  ngAfterViewChecked(): void {
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.playerAreaHeight = this.playerSplitArea.nativeElement.clientHeight;
    });
  }
}
