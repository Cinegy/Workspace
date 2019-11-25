import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WsCisLoginComponent } from './ws-cis-login.component';
import { MessagesModule } from 'primeng/primeng';
import { MatSelectModule, MatInputModule, MatButtonModule, MatCardModule } from '@angular/material';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { WsConfigurationModule } from '../ws-configuration/ws-configuration.module';

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
