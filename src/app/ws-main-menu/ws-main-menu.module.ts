import { SimpleTimer } from 'ng2-simple-timer';
import { WsUserInfoDialogComponent } from './../ws-dialogs/ws-user-info-dialog/ws-user-info-dialog.component';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WsMainMenuComponent } from './ws-main-menu.component';
import { MatToolbarModule, MatInputModule } from '@angular/material';
import { MatMenuModule } from '@angular/material';
import { MatButtonModule } from '@angular/material';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatToolbarModule,
    MatMenuModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule
  ],
  exports: [
    WsMainMenuComponent
  ],
  providers: [SimpleTimer],
  declarations: [WsMainMenuComponent],
  entryComponents: [
    WsUserInfoDialogComponent
  ]
})
export class WsMainMenuModule { }
