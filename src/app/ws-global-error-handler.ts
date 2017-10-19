import { WsErrorDialogComponent } from './ws-dialogs/ws-error-dialog/ws-error-dialog.component';
import { MatSnackBar } from '@angular/material';
import { Injectable, ErrorHandler, Injector } from '@angular/core';

@Injectable()
export class WsGlobalErrorHandler implements ErrorHandler {
  // private dialog: MdDialog = null;
  private snackBar: MatSnackBar = null;

  constructor(private injector: Injector) {}

  handleError(error) {
    console.log(error.message);

    if (this.snackBar === null) {
      this.snackBar = this.injector.get(MatSnackBar);
    }

    let msg: string;
    if (error.message) {
      msg = error.message;
    } else {
      msg = error;
    }

    this.snackBar.open(msg, 'close');

     // IMPORTANT: Rethrow the error otherwise it gets swallowed
    //  throw error;
 }

}
