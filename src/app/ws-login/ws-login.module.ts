import { WsConfigurationModule } from './../ws-configuration/ws-configuration.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WsLoginComponent } from './ws-login.component';
import { MdInputModule } from '@angular/material';
import { MdCardModule } from '@angular/material';
import { MdButtonModule } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MdSelectModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  imports: [
    CommonModule,
    WsConfigurationModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MdCardModule,
    MdInputModule,
    MdButtonModule,
    MdSelectModule
  ],
  declarations: [WsLoginComponent]
})
export class WsLoginModule { }
