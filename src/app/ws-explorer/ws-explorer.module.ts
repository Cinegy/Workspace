import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { WsExplorerComponent } from './ws-explorer.component';
import { WsExplorerService } from './ws-explorer.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { WsBaseMamInterceptor } from '../shared/services/ws-base-mam/ws-base-mam-interceptor';
import { WsDialogsModule } from '../ws-dialogs/ws-dialogs.module';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { ContextMenuModule} from 'primeng/contextmenu';
import { MatSelectModule } from '@angular/material/select/';
import { MatSnackBarModule } from '@angular/material/snack-bar/';
import { MatTooltipModule } from '@angular/material/tooltip';
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
