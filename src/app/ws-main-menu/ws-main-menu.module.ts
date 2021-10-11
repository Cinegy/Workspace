import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { WsMainMenuComponent } from './ws-main-menu.component';
import { SimpleTimer } from 'ng2-simple-timer';
import { WsUserInfoDialogComponent } from '../ws-dialogs/ws-user-info-dialog/ws-user-info-dialog.component';
import {MatCheckboxModule} from "@angular/material/checkbox";
import {FlexLayoutModule} from "@angular/flex-layout";
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
        MatFormFieldModule,
        MatCheckboxModule,
        FlexLayoutModule

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
