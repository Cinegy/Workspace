import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Component, OnInit, Inject } from '@angular/core';

@Component({
  selector: 'app-ws-error-dialog',
  templateUrl: './ws-error-dialog.component.html',
  styleUrls: ['./ws-error-dialog.component.css']
})
export class WsErrorDialogComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<WsErrorDialogComponent>) { }

  ngOnInit() {
  }

}
