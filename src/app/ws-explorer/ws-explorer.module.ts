import { WsExplorerService } from './ws-explorer.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WsExplorerComponent } from './ws-explorer.component';
import { MdCardModule } from '@angular/material';
import { MdButtonModule } from '@angular/material';
import { PanelModule } from 'primeng/primeng';
import { MdListModule } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
    MdCardModule,
    MdButtonModule,
    PanelModule,
    MdListModule
  ],
  declarations: [WsExplorerComponent],
  providers: [WsExplorerService],
  exports: [WsExplorerComponent]
})
export class WsExplorerModule { }
