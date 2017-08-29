import { MD_DIALOG_DATA, MdDialogRef } from '@angular/material';
import { Component, OnInit, Inject } from '@angular/core';

@Component({
  selector: 'app-ws-error-dialog',
  templateUrl: './ws-error-dialog.component.html',
  styleUrls: ['./ws-error-dialog.component.css']
})
export class WsErrorDialogComponent implements OnInit {

  constructor(
    @Inject(MD_DIALOG_DATA) public data: any,
    public dialogRef: MdDialogRef<WsErrorDialogComponent>) { }

  ngOnInit() {
  }

}
