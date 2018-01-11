import { MatSnackBar, MatSnackBarModule, MatNativeDateModule } from '@angular/material';
import { WsDialogsModule } from './ws-dialogs/ws-dialogs.module';
import { WsGlobalErrorHandler } from './ws-global-error-handler';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { WsBaseMamInterceptor } from './shared/services/ws-base-mam/ws-base-mam-interceptor';
import 'hammerjs';
import { WsAppManagementService } from './ws-app-management.service';
import { WsAuthGuardService } from './ws-login/ws-auth-guard.service';
import { WsMainComponent } from './ws-main/ws-main.component';
import { WsMainModule } from './ws-main/ws-main.module';
import { WsAppStateService } from './ws-app-state.service';
import { WsLoginComponent } from './ws-login/ws-login.component';
import { WsConfigurationModule } from './ws-configuration/ws-configuration.module';
import { WsLoginModule } from './ws-login/ws-login.module';
import { WsMainMenuModule } from './ws-main-menu/ws-main-menu.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { WsPlayerComponent } from './ws-player/ws-player.component';
import { WsToggleFullscreenDirective } from './ws-toggle-fullscreen.directive';
import { MatIconRegistry } from '@angular/material/icon';
import { WsClipboardService } from './ws-clipboard/ws-clipboard.service';

const appRoutes: Routes = [
  { path: 'login', component: WsLoginComponent },
  { path: 'main',
    component: WsMainComponent,
    canActivate: [WsAuthGuardService]
   },
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '/login',
    pathMatch: 'full'
  }
];

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    RouterModule.forRoot(
      appRoutes,
      {useHash: true}
    ),
    BrowserModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    WsDialogsModule,
    MatSnackBarModule,
    MatNativeDateModule,
    WsMainModule,
    WsConfigurationModule,
    WsMainMenuModule,
    WsLoginModule
  ],
  providers: [
    WsAppStateService,
    WsAppManagementService,
    WsClipboardService,
    MatIconRegistry,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: WsBaseMamInterceptor,
      multi: true
    },
    {
      provide: ErrorHandler,
      useClass: WsGlobalErrorHandler
    }
  ],
  exports: [],
  entryComponents: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
