import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-ws-metadata-text-editor',
  templateUrl: './ws-metadata-text-editor.component.html',
  styleUrls: ['./ws-metadata-text-editor.component.css']
})
export class WsMetadataTextEditorComponent implements OnInit {

  public result: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<WsMetadataTextEditorComponent>) { }


  ngOnInit() {
  }

}
