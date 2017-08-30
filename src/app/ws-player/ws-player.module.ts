import { MdCardModule } from '@angular/material';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WsPlayerComponent } from './ws-player.component';

@NgModule({
  imports: [
    CommonModule,
    MdCardModule
  ],
  declarations: [WsPlayerComponent],
  exports: [WsPlayerComponent]
})
export class WsPlayerModule { }
