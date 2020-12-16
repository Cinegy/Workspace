import { NgModule } from "@angular/core";
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MessagesModule } from 'primeng/messages';
import { WsLoginComponent } from './ws-login.component';
import { WsLoginService } from './ws-login.service';
import { WsConfigurationService } from '../ws-configuration/ws-configuration.service';
import { WsConfigurationModule } from '../ws-configuration/ws-configuration.module';
import { WsAuthGuardService } from './ws-auth-guard.service';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule, MatCardTitle } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

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
        WsAuthGuardService, //WsAuthGuardService
        WsConfigurationService //WsConfigurationService
    ],
    declarations: [WsLoginComponent]

})
export class WsLoginModule {

}
