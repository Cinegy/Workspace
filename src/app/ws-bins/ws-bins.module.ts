import { WsDialogsModule } from './../ws-dialogs/ws-dialogs.module';
import { WsBaseMamInterceptor } from './../shared/services/ws-base-mam/ws-base-mam-interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { WsBinsService } from './ws-bins.service';
import { WsNodeImageModule } from './../ws-node-image/ws-node-image.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MdListModule, MdInputModule, MdTooltipModule, MdButtonModule, MdCardModule, MdTabsModule } from '@angular/material';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WsBinsComponent } from './ws-bins.component';
import { WsClipBinComponent } from './ws-clip-bin/ws-clip-bin.component';
import { ContextMenuModule, MenuItem } from 'primeng/primeng';

@NgModule({
  imports: [
    CommonModule,
    WsNodeImageModule,
    WsDialogsModule,
    FlexLayoutModule,
    ContextMenuModule,
    MdCardModule,
    MdButtonModule,
    MdTooltipModule,
    MdInputModule,
    MdListModule,
    MdTabsModule
  ],
  declarations: [WsBinsComponent, WsClipBinComponent],
  exports: [WsBinsComponent],
  providers: [WsBinsService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: WsBaseMamInterceptor,
      multi: true
    }]

})
export class WsBinsModule { }
