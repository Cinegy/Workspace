import { WsErrorDialogComponent } from './ws-error-dialog/ws-error-dialog.component';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule, MatInputModule, MatSelectModule, MatDialogModule, MatFormFieldModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TreeModule } from 'angular-tree-component';
import { NgModule } from '@angular/core';
import { WsCreateBinDialogComponent } from './ws-create-bin-dialog/ws-create-bin-dialog.component';
import { WsCreateFolderDialogComponent } from './ws-create-folder-dialog/ws-create-folder-dialog.component';
import { WsInfoDialogComponent } from './ws-info-dialog/ws-info-dialog.component';
import { WsNodeImageModule } from '../ws-node-image/ws-node-image.module';
import { WsDeleteDialogComponent } from './ws-delete-dialog/ws-delete-dialog.component';
import { WsJdfDialogComponent } from './ws-jdf-dialog/ws-jdf-dialog.component';
import { WsRenameDialogComponent } from './ws-rename-dialog/ws-rename-dialog.component';
import { WsUserInfoDialogComponent } from './ws-user-info-dialog/ws-user-info-dialog.component';
import { WsJdfBrowseService } from './ws-jdf-dialog/ws-jdf-browse.service';

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
    ReactiveFormsModule, 
    TreeModule,
   MatFormFieldModule
  ],
  declarations: [
    WsCreateFolderDialogComponent,
    WsInfoDialogComponent,
    WsDeleteDialogComponent,
    WsRenameDialogComponent,
    WsErrorDialogComponent,
    WsCreateBinDialogComponent,
    WsCreateFolderDialogComponent,
    WsInfoDialogComponent,
    WsDeleteDialogComponent,
    WsJdfDialogComponent,
    WsRenameDialogComponent,
    WsUserInfoDialogComponent,
    WsCreateBinDialogComponent,
    WsJdfDialogComponent
  ],
  providers: [
    WsJdfBrowseService
  ],
  exports: [
    WsCreateFolderDialogComponent,
    WsInfoDialogComponent,
    WsDeleteDialogComponent,
    WsRenameDialogComponent,
    WsErrorDialogComponent,
    WsCreateBinDialogComponent
  ],
  entryComponents: [
    WsCreateFolderDialogComponent,
    WsInfoDialogComponent,
    WsDeleteDialogComponent,
    WsRenameDialogComponent,
    WsErrorDialogComponent,
    WsCreateBinDialogComponent,
    WsJdfDialogComponent
  ]
})
export class WsDialogsModule { }