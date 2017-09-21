import { WsToggleFullscreenDirective } from './../ws-toggle-fullscreen.directive';
import { FormsModule } from '@angular/forms';
import { WsNodeImageModule } from './../ws-node-image/ws-node-image.module';
import { WsPlayerService } from './ws-player.service';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SimpleTimer } from 'ng2-simple-timer';
import { MdCardModule, MdButtonModule, MdSliderModule, MdTooltipModule } from '@angular/material';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WsPlayerComponent } from './ws-player.component';
import { SliderModule } from 'primeng/components/slider/slider';

@NgModule({
  imports: [
    CommonModule,
    WsNodeImageModule,
    FlexLayoutModule,
    FormsModule,
    SliderModule,
    MdCardModule,
    MdButtonModule,
    MdSliderModule,
    MdTooltipModule
  ],
  declarations: [WsPlayerComponent, WsToggleFullscreenDirective],
  exports: [WsPlayerComponent],
  providers: [SimpleTimer, WsPlayerService, WsToggleFullscreenDirective]
})
export class WsPlayerModule { }
