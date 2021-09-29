import {
  AfterContentInit,
  AfterViewChecked,
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
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
export class WsMainComponent implements OnInit, AfterContentInit, AfterViewChecked, AfterViewInit, OnDestroy {
  @ViewChild('playerSplitArea', {static: false}) playerSplitArea: any;

  public showMode: string;
  public isImport: boolean;
  public playerAreaHeight: number;
  private subscribers: any[];

  constructor(
    public breadcrumbService: WsMainBreadcrumbsService,
    public appState: WsAppStateService,
    public breakpointObserver: BreakpointObserver,
    private playerOverlay: Overlay
  ) {
    breakpointObserver.observe(
      [Breakpoints.HandsetPortrait]
    ).subscribe(result => {
      if (result.matches) {
        this.changeLayout('small');
      }
    });
    breakpointObserver.observe(
      [Breakpoints.HandsetLandscape]
    ).subscribe(result => {
      if (result.matches) {
        this.changeLayout('smallLandscape');
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

    this.subscribers = [];
    let subscriber = this.appState.changeClipPlayerLayoutSubject
      .subscribe(response => {
          if(this.appState.isClipPlayerOpened) {
            setTimeout(() => {
              this.areaChanged(null);
            }, 1000);
          }
        }
      );
    this.subscribers.push(subscriber);
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
  ngOnDestroy() {
    this.subscribers.forEach(element => {
      element.unsubscribe();
    });
  }

  private changeLayout(mode: string) {
    this.appState.layoutMode = mode;
  }

  public isShowExplorer() {
    if (this.appState.layoutMode == 'large') {
      return true;
    }
    if (this.appState.layoutMode == 'medium' && !this.appState.isBinOpened) {
      return true;
    }
    return false;
  }

  private createOverlay(): void {

    this.playerOverlay.create({
      hasBackdrop: true,
    });
  }

  get splitDirection(): string {
    if (this.appState.layoutMode == 'smallLandscape') {
      return 'horizontal';
    }
    return 'vertical';
  }
}
