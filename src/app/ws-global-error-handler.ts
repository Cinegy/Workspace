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

    this.dialog.open(WsErrorDialogComponent, {
      width: '600px',
      data: error.message
    });
    throw error;
 }

}
