import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { WsNodeImageModule } from './../ws-node-image/ws-node-image.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule, MatInputModule, MatSelectModule, MatDialogModule } from '@angular/material';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WsCreateFolderDialogComponent } from './ws-create-folder-dialog/ws-create-folder-dialog.component';
import { WsInfoDialogComponent } from './ws-info-dialog/ws-info-dialog.component';
import { WsDeleteDialogComponent } from './ws-delete-dialog/ws-delete-dialog.component';
import { WsRenameDialogComponent } from './ws-rename-dialog/ws-rename-dialog.component';
import { WsErrorDialogComponent } from './ws-error-dialog/ws-error-dialog.component';
import { WsCreateBinDialogComponent } from './ws-create-bin-dialog/ws-create-bin-dialog.component';
import { WsUserInfoDialogComponent } from './ws-user-info-dialog/ws-user-info-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
    WsNodeImageModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    WsCreateFolderDialogComponent,
    WsInfoDialogComponent,
    WsDeleteDialogComponent,
    WsRenameDialogComponent,
    WsErrorDialogComponent,
    WsCreateBinDialogComponent,
    WsUserInfoDialogComponent],
  exports: [
    WsCreateFolderDialogComponent,
    WsInfoDialogComponent,
    WsDeleteDialogComponent,
    WsRenameDialogComponent,
    WsErrorDialogComponent,
    WsCreateBinDialogComponent],
  entryComponents: [
    WsCreateFolderDialogComponent,
    WsInfoDialogComponent,
    WsDeleteDialogComponent,
    WsRenameDialogComponent,
    WsErrorDialogComponent,
    WsCreateBinDialogComponent]
})
export class WsDialogsModule { }
