import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WsUploadComponent } from './ws-upload.component';
import { WsCisService } from '../shared/services/ws-cis/ws-cis.service';
import { SimpleTimer } from 'ng2-simple-timer';
import { MatIconModule, MatButtonModule, MatProgressBarModule, MatSnackBarModule, MatDialogModule, MatSelectModule, MatListModule, MatCardModule, MatTooltipModule, MatInputModule } from '@angular/material';
import { HttpClientModule } from '@angular/common/http';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FileUploadModule } from 'ng2-file-upload';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

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
