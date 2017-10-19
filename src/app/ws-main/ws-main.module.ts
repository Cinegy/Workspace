import { WsPlayerModule } from './../ws-player/ws-player.module';
import { WsNodeImageModule } from './../ws-node-image/ws-node-image.module';
import { WsBinsModule } from './../ws-bins/ws-bins.module';
import { WsMetadataModule } from './../ws-metadata/ws-metadata.module';
import { WsMainBreadcrumbsService } from './ws-main-breadcrumbs.service';
import { WsExplorerModule } from './../ws-explorer/ws-explorer.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { WsMainComponent } from './ws-main.component';
import { BreadcrumbModule, MenuItem, PanelModule } from 'primeng/primeng';
import { MatCardModule } from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FlexLayoutModule,
    BreadcrumbModule,
    MatCardModule,
    PanelModule,
    WsExplorerModule,
    WsBinsModule,
    WsMetadataModule,
    WsPlayerModule
  ],
  declarations: [WsMainComponent],
  providers: [WsMainBreadcrumbsService]
})
export class WsMainModule { }
