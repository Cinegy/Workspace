import { WsNodeImageModule } from './../ws-node-image/ws-node-image.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MdListModule, MdInputModule, MdTooltipModule, MdButtonModule, MdCardModule, MdTabsModule } from '@angular/material';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WsBinsComponent } from './ws-bins.component';

@NgModule({
  imports: [
    CommonModule,
    WsNodeImageModule,
    FlexLayoutModule,
    MdCardModule,
    MdButtonModule,
    MdTooltipModule,
    MdInputModule,
    MdListModule,
    MdTabsModule
  ],
  declarations: [WsBinsComponent],
  exports: [WsBinsComponent]
})
export class WsBinsModule { }
