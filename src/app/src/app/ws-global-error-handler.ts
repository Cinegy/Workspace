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


import { MatDialog } from '@angular/material';
import { Injectable, ErrorHandler, Injector, NgZone } from '@angular/core';
import { WsMamError } from './shared/services/ws-base-mam/ws-mam-error';
import { WsErrorDialogComponent } from './ws-dialogs/ws-error-dialog/ws-error-dialog.component';

@Injectable()
export class WsGlobalErrorHandler implements ErrorHandler {
  private dialog: MatDialog = null;

  constructor(private injector: Injector, private ngZone: NgZone) {
  }

  handleError(error) {

    this.ngZone.run(() => {
      console.log(error);

      if (this.dialog === null) {
        this.dialog = this.injector.get(MatDialog);
      }

      let msg: string;
      if (error instanceof WsMamError) {
        if (error.extMsg === 'heartbeat') {
          return;
        }
        // msg = error.extMsg;
        msg = error.msg ? error.msg : error.extMsg;

      } else if (error.message) {
        msg = error.message;
      } else {
        msg = error;
      }

      const dialogRef = this.dialog.open(WsErrorDialogComponent, {
        width: '600px',
        data: msg
      });
    });
  }

}
