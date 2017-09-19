import { WsErrorDialogComponent } from './ws-dialogs/ws-error-dialog/ws-error-dialog.component';
import { MdDialog } from '@angular/material';
import { Injectable, ErrorHandler, Injector } from '@angular/core';

@Injectable()
export class WsGlobalErrorHandler implements ErrorHandler {
  private dialog: MdDialog = null;

  constructor(private injector: Injector) {}

  handleError(error) {
    console.log(error.message);
    if (this.dialog === null) {
      this.dialog = this.injector.get(MdDialog);
    }

    let msg: string;
    if (error.message) {
      msg = error.message;
    } else {
      msg = error;
    }
    this.dialog.open(WsErrorDialogComponent, {
      width: '600px',
      data: msg
    });
    
    // throw error;
 }

}
