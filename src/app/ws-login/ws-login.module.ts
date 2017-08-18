import { WsAuthGuardService } from './ws-auth-guard.service';
import { WsLoginService } from './ws-login.service';
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
import { MessagesModule } from 'primeng/primeng';


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
    MdSelectModule,
    MessagesModule
  ],
  providers: [
    WsLoginService,
    WsAuthGuardService
  ],
  declarations: [WsLoginComponent]
})
export class WsLoginModule { }
