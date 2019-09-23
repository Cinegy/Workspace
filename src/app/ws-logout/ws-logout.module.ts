import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WsLogoutComponent } from './ws-logout.component';
import { WsLogoutService } from './ws-logout.service';
import { WsCisService } from '../shared/services/ws-cis/ws-cis.service';
import { WsAuthGuardService } from '../ws-login/ws-auth-guard.service';
import { WsConfigurationService } from '../ws-configuration/ws-configuration.service';
import { MatSelectModule, MatCardModule, MatInputModule, MatButtonModule } from '@angular/material';
import { WsConfigurationModule } from '../ws-configuration/ws-configuration.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';

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
