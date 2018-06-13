import { SimpleTimer } from 'ng2-simple-timer';
import { WsCisService } from './../shared/services/ws-cis/ws-cis.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule, MatTooltipModule, MatInputModule,
    MatListModule, MatSelectModule, MatDialogModule,
    MatSnackBarModule,
    MatButtonModule,
    MatIconModule, } from '@angular/material';
import { WsUploadComponent } from './ws-upload.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FileUploadModule } from 'ng2-file-upload';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
    HttpClientModule,
    FileUploadModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatTooltipModule,
    MatInputModule,
    MatListModule,
    MatSelectModule,
    MatDialogModule,
    MatSnackBarModule,
    MatProgressBarModule,
    MatButtonModule,
    MatIconModule
  ],
  declarations: [WsUploadComponent],
  providers: [WsCisService, SimpleTimer],
  exports: [WsUploadComponent]
})
export class WsUploadModule { }
