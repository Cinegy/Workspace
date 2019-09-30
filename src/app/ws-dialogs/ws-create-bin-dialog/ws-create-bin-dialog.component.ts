import { Component, OnInit, Inject } from '@angular/core';
import { WsAppStateService } from 'src/app/ws-app-state.service';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-ws-create-bin-dialog',
  templateUrl: './ws-create-bin-dialog.component.html',
  styleUrls: ['./ws-create-bin-dialog.component.css']
})
export class WsCreateBinDialogComponent implements OnInit {
  public result:any;

  constructor(public appState:WsAppStateService,
              @Inject(MAT_DIALOG_DATA) public data:any
              ) { }

  ngOnInit() {
  }

}
