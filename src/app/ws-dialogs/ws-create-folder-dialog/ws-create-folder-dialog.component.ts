import { WsAppStateService } from './../../ws-app-state.service';
import { Component, OnInit, Inject } from '@angular/core';
import { MdDialogRef, MD_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-ws-create-folder-dialog',
  templateUrl: './ws-create-folder-dialog.component.html',
  styleUrls: ['./ws-create-folder-dialog.component.css']
})
export class WsCreateFolderDialogComponent implements OnInit {
  public result: string;

  constructor(
    public appState: WsAppStateService,
    @Inject(MD_DIALOG_DATA) public data: any,
    public dialogRef: MdDialogRef<WsCreateFolderDialogComponent>) {}

  ngOnInit() {
  }

}
