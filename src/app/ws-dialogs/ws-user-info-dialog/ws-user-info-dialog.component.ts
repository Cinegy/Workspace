import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { WsMamConnection } from 'src/app/shared/services/ws-base-mam/ws-mam-connection';
import { WsConfigurationService } from 'src/app/ws-configuration/ws-configuration.service';

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
