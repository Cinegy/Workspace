import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WsMetadataTextEditorComponent } from './editors/ws-metadata-text-editor/ws-metadata-text-editor.component';
import { WsBaseMamInterceptor } from '../shared/services/ws-base-mam/ws-base-mam-interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { WsMetadataComponent } from './ws-metadata.component';
import { WsMetadataService } from './ws-metadata.service';
import { MatSnackBarModule, MatDialogModule, MatCardModule, MatButtonModule, MatTooltipModule, MatInputModule, MatListModule, MatTableModule, MatTabsModule, MatSelectModule, MatCheckboxModule, MatDatepickerModule } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { WsNodeImageModule } from '../ws-node-image/ws-node-image.module';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { BrowserModule } from '@angular/platform-browser';

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    FlexLayoutModule,
    FormsModule,
    WsNodeImageModule,
    MatCardModule,
    MatButtonModule,
    MatTooltipModule,
    MatInputModule,
    MatListModule,
    MatTableModule,
    MatTabsModule,
    MatListModule,
    MatTooltipModule,
    MatSelectModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatMomentDateModule,
    MatDialogModule,
    MatSnackBarModule
  ],
  declarations: [WsMetadataComponent, WsMetadataTextEditorComponent],
  exports: [WsMetadataComponent],
  providers: [WsMetadataService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: WsBaseMamInterceptor,
      multi: true
    }],
  entryComponents: [
    WsMetadataTextEditorComponent
  ]
})
export class WsMetadataModule { }
