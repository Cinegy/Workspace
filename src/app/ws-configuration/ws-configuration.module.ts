import { HttpClientModule } from '@angular/common/http';
import { WsConfigurationService } from './ws-configuration.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule
  ],
  exports: [
  ],
  declarations: [
  ],
  providers: [
    WsConfigurationService
  ]
})
export class WsConfigurationModule { }
