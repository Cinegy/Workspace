import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Component, OnInit, Inject } from '@angular/core';

@Component({
  selector: 'app-ws-delete-dialog',
  templateUrl: './ws-delete-dialog.component.html',
  styleUrls: ['./ws-delete-dialog.component.css']
})
export class WsDeleteDialogComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<WsDeleteDialogComponent>) { }

  ngOnInit() {
  }

}
