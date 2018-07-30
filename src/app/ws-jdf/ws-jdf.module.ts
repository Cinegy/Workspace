import { WsNodeImageModule } from './../ws-node-image/ws-node-image.module';
import { ReactiveFormsModule } from '@angular/forms';
import { WsBaseMamInterceptor } from './../shared/services/ws-base-mam/ws-base-mam-interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { WsJdfService } from './ws-jdf.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WsJdfComponent } from './ws-jdf.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';

@NgModule({
  imports: [
    CommonModule,
    WsNodeImageModule,
    MatTableModule,
    MatPaginatorModule,
    ReactiveFormsModule
  ],
  declarations: [WsJdfComponent],
  exports: [WsJdfComponent],
  providers: [WsJdfService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: WsBaseMamInterceptor,
      multi: true
    }]
})
export class WsJdfModule { }
