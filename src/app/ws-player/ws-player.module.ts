import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SimpleTimer } from 'ng2-simple-timer';
import { WsPlayerService } from './ws-player.service';
import { WsPlayerComponent } from './ws-player.component';
import { MatDialogModule, MatTooltipModule, MatSliderModule, MatButtonModule, MatCardModule, MatListModule  } from '@angular/material';
import {MatIconModule}  from '@angular/material/icon';
import { WsDialogsModule } from '../ws-dialogs/ws-dialogs.module';
import { SliderModule } from 'primeng/primeng';
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
