import { WsDialogsModule } from './../ws-dialogs/ws-dialogs.module';
import { WsToggleFullscreenDirective } from './../ws-toggle-fullscreen.directive';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatListModule, MatDialogModule } from '@angular/material';
import { WsNodeImageModule } from './../ws-node-image/ws-node-image.module';
import { WsPlayerService } from './ws-player.service';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SimpleTimer } from 'ng2-simple-timer';
import { MatCardModule, MatButtonModule, MatSliderModule, MatTooltipModule } from '@angular/material';
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
    ReactiveFormsModule,
    MatListModule,
    SliderModule,
    MatCardModule,
    MatButtonModule,
    MatSliderModule,
    MatTooltipModule,
    MatDialogModule,
    WsDialogsModule
  ],
  declarations: [WsPlayerComponent, WsToggleFullscreenDirective],
  exports: [WsPlayerComponent],
  providers: [SimpleTimer, WsPlayerService, WsToggleFullscreenDirective]
})
export class WsPlayerModule { }
