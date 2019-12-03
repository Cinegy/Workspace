import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WsNodeImageModule } from '../ws-node-image/ws-node-image.module';
import { MatTableModule, MatPaginatorModule } from '@angular/material';
import { ReactiveFormsModule } from '@angular/forms';
import { WsJdfComponent } from './ws-jdf.component';
import { WsJdfService } from './ws-jdf.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { WsBaseMamInterceptor } from '../shared/services/ws-base-mam/ws-base-mam-interceptor';

@NgModule({
  
  imports: [
    CommonModule,
   WsNodeImageModule,
    MatTableModule,
    MatPaginatorModule,
    ReactiveFormsModule
  ],
  declarations: [ WsJdfComponent],
  exports: [ WsJdfComponent],
  providers: [ WsJdfService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass:  WsBaseMamInterceptor,
      multi: true
    }]
})
export class WsJdfModule { }
