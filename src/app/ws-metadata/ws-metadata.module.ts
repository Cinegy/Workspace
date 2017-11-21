import { WsBaseMamInterceptor } from './../shared/services/ws-base-mam/ws-base-mam-interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { WsMetadataService } from './ws-metadata.service';
import { WsNodeImageModule } from './../ws-node-image/ws-node-image.module';
import { WsNodeImageComponent } from './../ws-node-image/ws-node-image.component';
// tslint:disable-next-line:max-line-length
import { MatCardModule, MatButtonModule, MatInputModule, MatTooltipModule, MatListModule,
  MatTableModule, MatTabsModule, MatSelectModule, MatCheckboxModule, MatDatepickerModule, MatDialogModule } from '@angular/material';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WsMetadataComponent } from './ws-metadata.component';
import { WsMetadataTextEditorComponent } from './editors/ws-metadata-text-editor/ws-metadata-text-editor.component';

@NgModule({
  imports: [
    CommonModule,
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
    MatDialogModule
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
