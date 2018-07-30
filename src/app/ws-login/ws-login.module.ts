import { WsConfigurationService } from './../ws-configuration/ws-configuration.service';
import { WsAuthGuardService } from './ws-auth-guard.service';
import { WsLoginService } from './ws-login.service';
import { WsConfigurationModule } from './../ws-configuration/ws-configuration.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WsLoginComponent } from './ws-login.component';
import { MatInputModule } from '@angular/material';
import { MatCardModule } from '@angular/material';
import { MatButtonModule } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatSelectModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MessagesModule } from 'primeng/primeng';
import { WsCisService } from '../shared/services/ws-cis/ws-cis.service';


@NgModule({
  imports: [
    CommonModule,
    WsConfigurationModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MessagesModule
  ],
  providers: [
    WsLoginService,
    WsCisService,
    WsAuthGuardService,
    WsConfigurationService
  ],
  declarations: [WsLoginComponent]
})
export class WsLoginModule { }
