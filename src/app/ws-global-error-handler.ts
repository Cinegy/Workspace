import { WsMamError } from './shared/services/ws-base-mam/ws-mam-error';
import { WsErrorDialogComponent } from './ws-dialogs/ws-error-dialog/ws-error-dialog.component';
import { MatDialog } from '@angular/material';
import { Injectable, ErrorHandler, Injector, NgZone } from '@angular/core';

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
