import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common'; import { WsConfigurationService } from './ws-configuration.service';
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