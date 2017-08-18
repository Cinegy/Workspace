import { WsMainBreadcrumbsService } from './ws-main-breadcrumbs.service';
import { WsExplorerModule } from './../ws-explorer/ws-explorer.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { WsMainComponent } from './ws-main.component';
import { BreadcrumbModule, MenuItem } from 'primeng/primeng';
import { MdCardModule } from '@angular/material';
import { PanelModule } from 'primeng/primeng';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FlexLayoutModule,
    BreadcrumbModule,
    MdCardModule,
    PanelModule,
    WsExplorerModule
  ],
  declarations: [WsMainComponent],
  providers: [WsMainBreadcrumbsService]
})
export class WsMainModule { }
