import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WsNodeImageModule } from '../ws-node-image/ws-node-image.module';
import { WsDialogsModule } from '../ws-dialogs/ws-dialogs.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ContextMenuModule } from 'primeng/primeng';
import { MatCardModule, MatButtonModule, MatTooltipModule, MatInputModule, MatListModule, MatTabsModule, MatPaginatorModule, MatCheckboxModule, MatSnackBarModule, MatDatepicker, MatDatepickerModule } from '@angular/material';
import { WsBinsComponent } from './ws-bins.component';
import { WsBinsService } from './ws-bins.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { WsBaseMamInterceptor } from '../shared/services/ws-base-mam/ws-base-mam-interceptor';

@NgModule({
  imports: [
    CommonModule,
    WsNodeImageModule,
    WsDialogsModule,
    FlexLayoutModule,
    ContextMenuModule,
    MatCardModule,
    MatButtonModule,
    MatTooltipModule,
    MatInputModule,
    MatListModule,
    MatTabsModule,
    MatPaginatorModule,
    MatCheckboxModule,
    MatSnackBarModule
  ],
  declarations: [WsBinsComponent],
  exports: [WsBinsComponent],
  providers: [WsBinsService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: WsBaseMamInterceptor,
      multi: true
    }]

})
export class WsBinsModule { }
