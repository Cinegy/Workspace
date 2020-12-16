import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WsUploadComponent } from './ws-upload.component';
import { WsCisService } from '../shared/services/ws-cis/ws-cis.service';
import { SimpleTimer } from 'ng2-simple-timer';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
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
