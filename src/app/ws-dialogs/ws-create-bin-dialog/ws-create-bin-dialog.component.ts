import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { NewBinParams } from './new-bin-params';
import { WsAppStateService } from 'src/app/ws-app-state.service';
import { WsAppManagementService } from 'src/app/ws-app-management.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-ws-create-bin-dialog',
  templateUrl: './ws-create-bin-dialog.component.html',
  styleUrls: ['./ws-create-bin-dialog.component.css']
})
export class WsCreateBinDialogComponent implements OnInit, OnDestroy {
  public subscribers: any[];
  public result = new NewBinParams();

  constructor(
    public appState: WsAppStateService,
    private management: WsAppManagementService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<WsCreateBinDialogComponent>) {
    this.subscribers = [];
  }

  ngOnInit() {
    const descriptors = this.appState.descriptors[this.data.type];
    this.setMediaGroupDescriptors(descriptors);
  }

  ngOnDestroy() {
    this.subscribers.forEach(element => {
      element.unsubscribe();
    });
  }

  private setMediaGroupDescriptors(descriptors: any) {
    // tslint:disable-next-line:prefer-const
    for (let descriptor of descriptors) {
      if (descriptor.nameInternal === 'media_group_id') {
        this.result.descriptor = descriptor;
        return;
      }
    }
  }
}