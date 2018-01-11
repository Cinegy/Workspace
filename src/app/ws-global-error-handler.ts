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
      console.log(error.message);

      if (this.dialog == null) {
        this.dialog = this.injector.get(MatDialog);
      }

      let msg: string;
      if (error.message) {
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
