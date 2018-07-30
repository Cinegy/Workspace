import { WsAuthGuardService } from './../ws-login/ws-auth-guard.service';
import { WsCisService } from './../shared/services/ws-cis/ws-cis.service';
import { WsLogoutService } from './ws-logout.service';
import { MatSelectModule, MatButtonModule, MatInputModule, MatCardModule } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { WsConfigurationModule } from './../ws-configuration/ws-configuration.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WsLogoutComponent } from './ws-logout.component';
import { WsConfigurationService } from '../ws-configuration/ws-configuration.service';

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
    MatSelectModule
  ],
  providers: [
    WsLogoutService,
    WsCisService,
    WsAuthGuardService,
    WsConfigurationService
  ],
  declarations: [WsLogoutComponent]
})
export class WsLogoutModule { }
