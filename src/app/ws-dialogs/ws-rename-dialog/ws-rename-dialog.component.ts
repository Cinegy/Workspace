import { MD_DIALOG_DATA, MdDialogRef } from '@angular/material';
import { WsAppStateService } from './../../ws-app-state.service';
import { Component, OnInit, Inject } from '@angular/core';

@Component({
  selector: 'app-ws-rename-dialog',
  templateUrl: './ws-rename-dialog.component.html',
  styleUrls: ['./ws-rename-dialog.component.css']
})
export class WsRenameDialogComponent implements OnInit {

  constructor(
    public appState: WsAppStateService,
    @Inject(MD_DIALOG_DATA) public data: any,
    public dialogRef: MdDialogRef<WsRenameDialogComponent>) { }

  ngOnInit() {
  }

}
