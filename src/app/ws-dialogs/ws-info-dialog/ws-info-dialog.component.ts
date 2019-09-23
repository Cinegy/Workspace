import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-ws-info-dialog',
  templateUrl: './ws-info-dialog.component.html',
  styleUrls: ['./ws-info-dialog.component.css']
})
export class WsInfoDialogComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<WsInfoDialogComponent>) { }

  ngOnInit() {
  }

}

