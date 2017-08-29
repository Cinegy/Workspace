import { WsBinsService } from './ws-bins.service';
import { WsNodeImageModule } from './../ws-node-image/ws-node-image.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MdListModule, MdInputModule, MdTooltipModule, MdButtonModule, MdCardModule, MdTabsModule } from '@angular/material';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WsBinsComponent } from './ws-bins.component';
import { WsClipBinComponent } from './ws-clip-bin/ws-clip-bin.component';
import {TabViewModule} from 'primeng/primeng';

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
    MdTabsModule,
    TabViewModule
  ],
  declarations: [WsBinsComponent, WsClipBinComponent],
  exports: [WsBinsComponent],
  providers: [WsBinsService]

})
export class WsBinsModule { }
