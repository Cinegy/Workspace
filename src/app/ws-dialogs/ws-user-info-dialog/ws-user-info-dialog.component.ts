import { WsConfigurationService } from './../../ws-configuration/ws-configuration.service';
import { WsMamConnection } from './../../shared/services/ws-base-mam/ws-mam-connection';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Component, OnInit, Inject } from '@angular/core';

@Component({
  selector: 'app-ws-user-info-dialog',
  templateUrl: './ws-user-info-dialog.component.html',
  styleUrls: ['./ws-user-info-dialog.component.css']
})
export class WsUserInfoDialogComponent implements OnInit {
  public workspaceVersion: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: WsMamConnection,
    public dialogRef: MatDialogRef<WsUserInfoDialogComponent>,
    private configService: WsConfigurationService) {
      this.workspaceVersion = this.configService.getVersion();
     }


  ngOnInit() {
  }

}
