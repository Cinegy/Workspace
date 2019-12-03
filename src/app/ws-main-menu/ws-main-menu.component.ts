import { Component, OnInit, OnDestroy, VERSION } from '@angular/core';
import { WsMamError } from '../shared/services/ws-base-mam/ws-mam-error';
import { MatIconRegistry, MatSnackBar, MatDialog } from '@angular/material';
import { SimpleTimer } from 'ng2-simple-timer';
import { WsAppManagementService } from '../ws-app-management.service';
import { WsConfigurationService } from '../ws-configuration/ws-configuration.service';
import { WsLoginService } from '../ws-login/ws-login.service';
import { WsAppStateService } from '../ws-app-state.service';
import { Router } from '@angular/router';
import { WsBinsService } from '../ws-bins/ws-bins.service';
import { WsLogoutService } from '../ws-logout/ws-logout.service';
import { WsUserInfoDialogComponent } from '../ws-dialogs/ws-user-info-dialog/ws-user-info-dialog.component';

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
    public logoutService: WsLogoutService,
    public configService: WsConfigurationService,
    private management: WsAppManagementService,
    private timer: SimpleTimer,
    public snackBar: MatSnackBar,
    private matIconRegistry: MatIconRegistry) {
    this.angularVersion = `Angular v${VERSION.full}`;
    this.matIconRegistry.registerFontClassAlias('fontawesome', 'fa');
    this.timerIconName = this.timerIconNames[0];
    this.subscribers = [];
  }

  ngOnInit() {
    let subscriber = this.loginService.loginSubject
      .subscribe(response => this.loginResponse(response));
    this.subscribers.push(subscriber);

    subscriber = this.logoutService.logoutSubject
      .subscribe(response => this.logoutResponse(response));
    this.subscribers.push(subscriber);


    subscriber = this.management.heartbeatSubject
      .subscribe(response => this.heartbeatResponse(response));
    this.subscribers.push(subscriber);

    subscriber = this.loginService.reconnectSubject
      .subscribe(response => this.reconnectResponse(response));
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

  public goHome() {
    this.router.navigate(['/main']);
  }

  public logout() {
    this.logoutService.logout();

    if (this.configService.configuration.cis.useCis) {
      this.router.navigate(['/cislogin']);
    } else {
      this.router.navigate(['/login']);
    }

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

    this.timer.newTimer(this.timerName, 20);
    this.timerId = this.timer.subscribe(this.timerName, () => this.timerCallback());
  }

  private reconnectResponse(response: any) {

    if (response.error || response instanceof WsMamError) {
      return;
    }
    this.snackBar.open('Successfully reconnected', null, { duration: 5000 });
  }

  private logoutResponse(response: any) {
    this.stopTimer();
  }

  private heartbeatResponse(response: any) {
    if (response instanceof WsMamError) {
      this.snackBar.open('Cannot connect to Backend. Reconnecting...', null, { duration: 3000 });
      this.loginService.login(this.appState.selectedMam, true);
    }
  }

  private timerCallback() {
    this.management.heartbeat();
    console.log(new Date(Date.now()));

    // if (navigator.onLine) {
    //   this.isOnline = 'Online';
    // } else {
    //   this.isOnline = 'Offline. No Internet connection.';
    // }

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
