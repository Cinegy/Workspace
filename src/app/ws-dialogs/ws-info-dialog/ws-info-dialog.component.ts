import { MD_DIALOG_DATA, MdDialogRef } from '@angular/material';
import { Component, OnInit, Inject } from '@angular/core';

@Component({
  selector: 'app-ws-info-dialog',
  templateUrl: './ws-info-dialog.component.html',
  styleUrls: ['./ws-info-dialog.component.css']
})
export class WsInfoDialogComponent implements OnInit {

  constructor(
    @Inject(MD_DIALOG_DATA) public data: any,
    public dialogRef: MdDialogRef<WsInfoDialogComponent>) { }

  ngOnInit() {
  }

}
