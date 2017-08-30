import { WsDialogsModule } from './../ws-dialogs/ws-dialogs.module';
import { WsNodeImageModule } from './../ws-node-image/ws-node-image.module';
import { WsNodeImageComponent } from './../ws-node-image/ws-node-image.component';
import { WsExplorerService } from './ws-explorer.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WsExplorerComponent } from './ws-explorer.component';
import { MdCardModule, MdSelectModule } from '@angular/material';
import { MdButtonModule } from '@angular/material';
import { MdListModule, MdTooltipModule, MdInputModule, MdDialogModule } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
// tslint:disable-next-line:max-line-length
import {
  ContextMenuModule,
  MenuItem
} from 'primeng/primeng';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
    MdCardModule,
    MdButtonModule,
    MdTooltipModule,
    MdInputModule,
    MdListModule,
    MdSelectModule,
    MdDialogModule,
    ContextMenuModule,
    FormsModule,
    ReactiveFormsModule,
    WsNodeImageModule,
    WsDialogsModule,
  ],
  declarations: [WsExplorerComponent],
  providers: [WsExplorerService],
  exports: [WsExplorerComponent]
})
export class WsExplorerModule { }
