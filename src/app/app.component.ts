/*
Cinegy Workspace - An HTML5 Front-End to Cinegy Archive
Copyright (C) 2018  Cinegy GmbH
 
	This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
	
*/

import { WsMamError } from './shared/services/ws-base-mam/ws-mam-error';
import { Router } from '@angular/router';
import { WsLoginService } from './ws-login/ws-login.service';
import { WsAppStateService } from './ws-app-state.service';
import { WsAppManagementService } from './ws-app-management.service';
import { Observable } from 'rxjs/Observable';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { WsConfigurationService } from './ws-configuration/ws-configuration.service';

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
    private config: WsConfigurationService,
    private router: Router) {
    this.subscribers = [];
  }

  public ngOnInit() {
    console.log('*** Application started ***');

    const subscriber = this.appState.loggedInSubject
      .subscribe(response => this.loginResponse(response));
    this.subscribers.push(subscriber);

    this.appState.itemsPerPage = this.config.configuration.itemsPerPage;
  }

  ngOnDestroy() {
    this.subscribers.forEach(element => {
      element.unsubscribe();
    });
  }

  private loginResponse(response: any) {
    this.management.initialize();
    this.router.navigate(['/main']);
  }
}
