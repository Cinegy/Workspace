import { WsErrorDialogComponent } from './../ws-dialogs/ws-error-dialog/ws-error-dialog.component';
import { WsAppManagementService } from './../ws-app-management.service';
import { SimpleTimer } from 'ng2-simple-timer';
import { WsMamError } from './../shared/services/ws-base-mam/ws-mam-error';
import { WsUserInfoDialogComponent } from './../ws-dialogs/ws-user-info-dialog/ws-user-info-dialog.component';
import { MatDialog } from '@angular/material';
import { WsConfigurationService } from './../ws-configuration/ws-configuration.service';
import { WsBinsService } from './../ws-bins/ws-bins.service';
import { WsLoginService } from './../ws-login/ws-login.service';
import { WsAppStateService } from './../ws-app-state.service';
import { Component, OnInit, VERSION, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ws-main-menu',
  templateUrl: './ws-main-menu.component.html',
  styleUrls: ['./ws-main-menu.component.css']
})
export class WsMainMenuComponent implements OnInit, OnDestroy {
  private timerName = 'heartbeat';
  private timerId: string;
  private subscribers: any[];
  public menusDisabled = true;
  public keywords = '';
  public angularVersion = '';
  public timerIconNames = ['power-off', 'heartbeat', 'heart-o'];
  public timerIconIndex = 0;
  public timerIconName: string;

  constructor(
    private router: Router,
    private binService: WsBinsService,
    public appState: WsAppStateService,
    public connectionDialog: MatDialog,
    public errorDialog: MatDialog,
    public loginService: WsLoginService,
    public configService: WsConfigurationService,
    private management: WsAppManagementService,
    private timer: SimpleTimer) {
    this.angularVersion = `Angular v${VERSION.full}`;
    this.timerIconName = this.timerIconNames[0];
    this.subscribers = [];
  }

  ngOnInit() {
    let subscriber = this.loginService.loginSubject
      .subscribe(response => this.loginResponse(response));
    this.subscribers.push(subscriber);

    subscriber = this.loginService.logoutSubject
      .subscribe(response => this.logoutResponse(response));
    this.subscribers.push(subscriber);


    subscriber = this.management.heartbeatSubject
      .subscribe(response => this.heartbeatResponse(response));
    this.subscribers.push(subscriber);
  }

  ngOnDestroy() {
    this.subscribers.forEach(element => {
      element.unsubscribe();
    });
  }

  public showInfo() {
    this.connectionDialog.open(WsUserInfoDialogComponent, {
      width: '600px',
      data: this.appState.selectedMam
    });
  }

  public logout() {
    this.loginService.logout();
    this.router.navigate(['/login']);
  }

  public search() {

    if (this.keywords === null || this.keywords === '') {
      return;
    }

    this.binService.search(this.keywords);
  }

  private loginResponse(response: any) {

    if (response instanceof WsMamError) {
      return;
    }

    this.timer.newTimer(this.timerName, 5);
    this.timerId = this.timer.subscribe(this.timerName, () => this.timerCallback());
  }

  private logoutResponse(response: any) {
    this.stopTimer();
  }

  private heartbeatResponse(response: any) {
    if (response instanceof WsMamError) {
      this.stopTimer();

      const dialogRef = this.errorDialog.open(WsErrorDialogComponent, {
        width: '600px',
        data: 'MAM service down or Network failure'
      });
      dialogRef.afterClosed().subscribe(result => {
        this.logout();
      });
      return;
    }
  }

  private timerCallback() {
    this.management.heartbeat();

    if (this.timerIconIndex === 1) {
      this.timerIconIndex = 2;
    } else {
      this.timerIconIndex = 1;
    }

    this.timerIconName = this.timerIconNames[this.timerIconIndex];
  }

  private stopTimer() {
    this.timer.unsubscribe(this.timerId);
    this.timer.delTimer(this.timerName);
    this.timerIconName = this.timerIconNames[0];
  }

}
