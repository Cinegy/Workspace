import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WsMetadataTextEditorComponent } from './editors/ws-metadata-text-editor/ws-metadata-text-editor.component';
import { WsBaseMamInterceptor } from '../shared/services/ws-base-mam/ws-base-mam-interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { WsMetadataComponent } from './ws-metadata.component';
import { WsMetadataService } from './ws-metadata.service';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
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
