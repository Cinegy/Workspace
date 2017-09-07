import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WsMainMenuComponent } from './ws-main-menu.component';
import { MdToolbarModule, MdInputModule } from '@angular/material';
import { MdMenuModule } from '@angular/material';
import { MdButtonModule } from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MdToolbarModule,
    MdMenuModule,
    MdButtonModule,
    MdInputModule
  ],
  exports: [
    WsMainMenuComponent
  ],
  declarations: [WsMainMenuComponent]
})
export class WsMainMenuModule { }
