import { WsConfigurationModule } from './../ws-configuration/ws-configuration.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatSelectModule, MatButtonModule, MatInputModule, MatCardModule } from '@angular/material';
import { MessagesModule } from 'primeng/primeng';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WsCisLoginComponent } from './ws-cis-login.component';

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
  declarations: [WsCisLoginComponent]
})
export class WsCisLoginModule { }
