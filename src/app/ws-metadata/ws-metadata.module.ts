import { WsNodeImageModule } from './../ws-node-image/ws-node-image.module';
import { WsNodeImageComponent } from './../ws-node-image/ws-node-image.component';
import { MdCardModule, MdButtonModule, MdInputModule, MdTooltipModule, MdListModule } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WsMetadataComponent } from './ws-metadata.component';

@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
    MdCardModule,
    MdButtonModule,
    MdTooltipModule,
    MdInputModule,
    MdListModule,
    WsNodeImageModule
  ],
  declarations: [WsMetadataComponent],
  exports: [WsMetadataComponent]
})
export class WsMetadataModule { }
