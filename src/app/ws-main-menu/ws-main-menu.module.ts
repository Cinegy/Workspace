import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WsMainMenuComponent } from './ws-main-menu.component';
import { MdToolbarModule } from '@angular/material';
import { MdMenuModule } from '@angular/material';
import { MdButtonModule } from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    MdToolbarModule,
    MdMenuModule,
    MdButtonModule
  ],
  exports: [
    WsMainMenuComponent
  ],
  declarations: [WsMainMenuComponent]
})
export class WsMainMenuModule { }
