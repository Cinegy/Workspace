import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BreadcrumbModule, PanelModule, InputSwitchModule, SharedModule } from 'primeng/primeng';
import { MatCardModule, MatTabsModule, MatFormFieldModule } from '@angular/material';
import { WsMainComponent } from './ws-main.component';
import { WsMainBreadcrumbsService } from './ws-main-breadcrumbs.service';
import { WsExplorerModule } from '../ws-explorer/ws-explorer.module';
import { WsUploadModule } from '../ws-upload/ws-upload.module';
import { WsBinsModule } from '../ws-bins/ws-bins.module';
import { WsJdfModule } from '../ws-jdf/ws-jdf.module';
import { WsMetadataModule } from '../ws-metadata/ws-metadata.module';
import { WsPlayerModule } from '../ws-player/ws-player.module';
import { BrowserModule } from '@angular/platform-browser';
import { WsNewsModule } from '../ws-news/ws-news.module';
import { WsStoryModule } from '../ws-story/ws-story.module';


@NgModule({
  imports: [
    BrowserModule,
    CommonModule,
    RouterModule,
    FlexLayoutModule,
    BreadcrumbModule,
    MatCardModule,
    PanelModule,
    WsExplorerModule,
    WsBinsModule,
    WsMetadataModule,
    WsPlayerModule,
    WsUploadModule,
    WsJdfModule,
    MatTabsModule,
    WsNewsModule,
    WsStoryModule
  ],
  declarations: [WsMainComponent],
  providers: [WsMainBreadcrumbsService]
})
export class WsMainModule { }
