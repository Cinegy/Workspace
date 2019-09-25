import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatToolbarModule, MatMenuModule, MatButtonModule, MatInputModule, MatSnackBarModule, MatIconModule, MatFormFieldModule } from '@angular/material';
import { WsMainMenuComponent } from './ws-main-menu.component';
import { SimpleTimer } from 'ng2-simple-timer';
import { WsUserInfoDialogComponent } from '../ws-dialogs/ws-user-info-dialog/ws-user-info-dialog.component';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatToolbarModule,
    MatMenuModule,
    MatButtonModule,
    MatInputModule,
    MatSnackBarModule,
    MatIconModule,
    MatFormFieldModule

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
