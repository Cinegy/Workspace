import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WsMainMenuComponent } from './ws-main-menu.component';
import { MatToolbarModule, MatInputModule } from '@angular/material';
import { MatMenuModule } from '@angular/material';
import { MatButtonModule } from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatToolbarModule,
    MatMenuModule,
    MatButtonModule,
    MatInputModule
  ],
  exports: [
    WsMainMenuComponent
  ],
  declarations: [WsMainMenuComponent]
})
export class WsMainMenuModule { }
