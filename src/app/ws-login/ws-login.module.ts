import { NgModule } from "@angular/core";
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MessagesModule } from 'primeng/primeng';
import { WsLoginComponent } from './ws-login.component';
import { WsLoginService } from './ws-login.service';
import { WsCisService } from '../shared/services/ws-cis/ws-cis.service';
import { WsConfigurationService } from '../ws-configuration/ws-configuration.service';
import { WsConfigurationModule } from '../ws-configuration/ws-configuration.module';
import { WsAuthGuardService } from './ws-auth-guard.service';
import { MatSelectModule, MatFormFieldModule, MatInputModule, MatCardModule, MatButtonModule, MatCardTitle } from '@angular/material';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        FlexLayoutModule,
        MessagesModule,
        WsConfigurationModule,//WsConfigurationModule    
        MatFormFieldModule,
        MatCardModule,
        MatInputModule,
        MatButtonModule,
        MatSelectModule,
    ],
    providers: [
        WsLoginService, //WsLoginService
        WsCisService, //WsCisService
        WsAuthGuardService, //WsAuthGuardService
        WsConfigurationService //WsConfigurationService
    ],
    declarations: [WsLoginComponent]

})
export class WsLoginModule {

}