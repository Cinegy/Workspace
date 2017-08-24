import { MD_DIALOG_DATA, MdDialogRef } from '@angular/material';
import { Component, OnInit, Inject } from '@angular/core';

@Component({
  selector: 'app-ws-delete-dialog',
  templateUrl: './ws-delete-dialog.component.html',
  styleUrls: ['./ws-delete-dialog.component.css']
})
export class WsDeleteDialogComponent implements OnInit {

  constructor(
    @Inject(MD_DIALOG_DATA) public data: any,
    public dialogRef: MdDialogRef<WsDeleteDialogComponent>) { }

  ngOnInit() {
  }

}
