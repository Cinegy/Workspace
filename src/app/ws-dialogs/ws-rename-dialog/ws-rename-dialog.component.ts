import { Component, OnInit, Inject } from '@angular/core';
import { WsAppStateService } from '../../ws-app-state.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-ws-rename-dialog',
  templateUrl: './ws-rename-dialog.component.html',
  styleUrls: ['./ws-rename-dialog.component.css']
})
export class WsRenameDialogComponent implements OnInit {

  constructor(
    public appState: WsAppStateService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<WsRenameDialogComponent>) { }

  ngOnInit() {
  }

}
