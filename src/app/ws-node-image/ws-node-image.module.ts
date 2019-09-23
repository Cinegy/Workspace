import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WsNodeImageComponent } from './ws-node-image.component';

@NgModule({
  
  imports: [
    CommonModule
  ],declarations: [WsNodeImageComponent],
   exports:[WsNodeImageComponent]
})
export class WsNodeImageModule { }
