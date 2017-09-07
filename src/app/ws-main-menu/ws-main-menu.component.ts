import { WsBinsService } from './../ws-bins/ws-bins.service';
import { WsLoginService } from './../ws-login/ws-login.service';
import { WsAppStateService } from './../ws-app-state.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ws-main-menu',
  templateUrl: './ws-main-menu.component.html',
  styleUrls: ['./ws-main-menu.component.css']
})
export class WsMainMenuComponent implements OnInit {
  public menusDisabled = true;
  public keywords = '';

  constructor(
    private router: Router,
    private binService: WsBinsService,
    public appState: WsAppStateService,
    public loginService: WsLoginService) { }

  ngOnInit() {
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

}
