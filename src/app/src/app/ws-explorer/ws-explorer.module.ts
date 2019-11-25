import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { WsExplorerComponent } from './ws-explorer.component';
import { WsExplorerService } from './ws-explorer.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { WsBaseMamInterceptor } from '../shared/services/ws-base-mam/ws-base-mam-interceptor';
import { WsDialogsModule } from '../ws-dialogs/ws-dialogs.module';
import {
  MatCardModule, MatButtonModule, MatTooltipModule, MatInputModule,
  MatSelectModule, MatDialogModule, MatSnackBarModule
} from '@angular/material';
import { ContextMenuModule } from 'primeng/primeng';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DragulaModule, DragulaService } from 'ng2-dragula';
import { MatListModule } from '@angular/material/list'
import { WsNodeImageModule } from '../ws-node-image/ws-node-image.module';
@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatCardModule,
    MatButtonModule,
    MatTooltipModule,
    MatInputModule,
    MatListModule,
    MatSelectModule,
    MatDialogModule,
    MatSnackBarModule,
    ContextMenuModule,
    FormsModule,
    ReactiveFormsModule,
    WsNodeImageModule,
    WsDialogsModule,
    DragulaModule,
    MatListModule
  ],
  declarations: [WsExplorerComponent],
  providers: [WsExplorerService, DragulaService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: WsBaseMamInterceptor,
      multi: true
    }],
  exports: [WsExplorerComponent]
})
export class WsExplorerModule { }
