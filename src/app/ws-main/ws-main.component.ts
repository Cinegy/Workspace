import {AfterContentInit, AfterViewChecked, AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {WsMainBreadcrumbsService} from './ws-main-breadcrumbs.service';
import {WsAppStateService} from '../ws-app-state.service';
import {SplitComponent, SplitAreaDirective} from 'angular-split';
import {BreakpointObserver, Breakpoints, BreakpointState} from "@angular/cdk/layout";
import {Overlay} from "@angular/cdk/overlay";

@Component({
  selector: 'app-ws-main',
  templateUrl: './ws-main.component.html',
  styleUrls: ['./ws-main.component.scss']
})
export class WsMainComponent implements OnInit, AfterContentInit, AfterViewChecked, AfterViewInit {
  @ViewChild('playerSplitArea', {static: false}) playerSplitArea: any;

  public showMode: string;
  public isImport: boolean;
  public playerAreaHeight: number;

  constructor(
    public breadcrumbService: WsMainBreadcrumbsService,
    public appState: WsAppStateService,
    public breakpointObserver: BreakpointObserver,
    private playerOverlay: Overlay
  ) {
    breakpointObserver.observe(
      [Breakpoints.Handset]
    ).subscribe(result => {
      if (result.matches) {
        this.changeLayout('small');
      }
    });
    breakpointObserver.observe(
      [Breakpoints.Tablet]
    ).subscribe(result => {
      if (result.matches) {
        this.changeLayout('medium');
      }
    });
    breakpointObserver.observe(
      [Breakpoints.Web]
    ).subscribe(result => {
      if (result.matches) {
        this.changeLayout('large');
      }
    });
    this.showMode = appState.showMode;
    this.isImport = (this.appState.selectedMam.uploadStores != undefined);
  }

  ngOnInit() {
    this.breadcrumbService.reset();
    this.createOverlay();
  }

  areaChanged(event) {
    if (this.playerSplitArea && this.playerSplitArea.nativeElement) {
      this.playerAreaHeight = this.playerSplitArea.nativeElement.clientHeight;
    }
  }

  ngAfterContentInit(): void {
    if (this.playerSplitArea && this.playerSplitArea.nativeElement) {
      this.playerAreaHeight = this.playerSplitArea.nativeElement.clientHeight;
    }
  }

  ngAfterViewChecked(): void {
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      if (this.playerSplitArea && this.playerSplitArea.nativeElement) {
        this.playerAreaHeight = this.playerSplitArea.nativeElement.clientHeight;
      }
    });
  }

  private changeLayout(mode: string) {
    this.appState.layoutMode = mode;
  }

  public isShowExplorer() {
    if(this.appState.layoutMode == 'large') {
      return true;
    }
    if(this.appState.layoutMode == 'medium' && !this.appState.isBinOpened) {
      return true;
    }
    return false;
  }
  private createOverlay(): void {

    this.playerOverlay.create({
      hasBackdrop: true,
    });
  }
}
