import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SimpleTimer } from 'ng2-simple-timer';
import { WsPlayerService } from './ws-player.service';
import { WsPlayerComponent } from './ws-player.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { MatSliderModule } from '@angular/material/slider';
import { MatTooltipModule } from '@angular/material/tooltip';
import {MatIconModule}  from '@angular/material/icon';
import { WsDialogsModule } from '../ws-dialogs/ws-dialogs.module';
import { SliderModule } from 'primeng/slider';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { WsNodeImageModule } from '../ws-node-image/ws-node-image.module';
import { WsToggleFullscreenDirective } from '../ws-toggle-fullscreen.directive';

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
    WsDialogsModule,
    MatIconModule
  ],
  declarations: [WsPlayerComponent, WsToggleFullscreenDirective],
  exports: [WsPlayerComponent],
  providers: [SimpleTimer,WsPlayerService, WsToggleFullscreenDirective]
})
export class WsPlayerModule { }
