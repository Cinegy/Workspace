import { WsConfigurationService } from './ws-configuration/ws-configuration.service';
import { WsCisLoginComponent } from './ws-cis-login/ws-cis-login.component';
import { WsCisLoginModule } from './ws-cis-login/ws-cis-login.module';
import { WsLogoutComponent } from './ws-logout/ws-logout.component';
import { WsLogoutModule } from './ws-logout/ws-logout.module';
import { MatSnackBar, MatSnackBarModule, MatNativeDateModule } from '@angular/material';
import { WsDialogsModule } from './ws-dialogs/ws-dialogs.module';
import { WsGlobalErrorHandler } from './ws-global-error-handler';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { WsBaseMamInterceptor } from './shared/services/ws-base-mam/ws-base-mam-interceptor';
import 'hammerjs';
import 'crypto';
import 'webcrypto';
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
import { NgModule, ErrorHandler, APP_INITIALIZER } from '@angular/core';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { WsPlayerComponent } from './ws-player/ws-player.component';
import { WsToggleFullscreenDirective } from './ws-toggle-fullscreen.directive';
import { MatIconRegistry } from '@angular/material/icon';
import { WsClipboardService } from './ws-clipboard/ws-clipboard.service';
import { WsUploadComponent } from './ws-upload/ws-upload.component';
import { CookieService } from 'ngx-cookie-service';
import { LocalStorageModule } from 'angular-2-local-storage';

const appRoutes: Routes = [
  { path: 'cislogin', component: WsCisLoginComponent },
  { path: 'logout', component: WsLogoutComponent },
  { path: 'login', component: WsLoginComponent },
  {
    path: 'main',
    component: WsMainComponent,
    canActivate: [WsAuthGuardService]
  },
  {
    path: '',
    redirectTo: '/main',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '/main',
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
      { useHash: false }
    ),
    LocalStorageModule.withConfig({
      prefix: 'cinegy-workspace',
      storageType: 'localStorage'
    }),
    BrowserModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    WsDialogsModule,
    MatSnackBarModule,
    MatNativeDateModule,
    WsMainModule,
    WsConfigurationModule,
    WsMainMenuModule,
    WsLoginModule,
    WsLogoutModule,
    WsCisLoginModule
  ],
  providers: [
    WsAppStateService,
    WsAppManagementService,
    WsClipboardService,
    CookieService,
    MatIconRegistry,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: WsBaseMamInterceptor,
      multi: true
    },
    {
      provide: ErrorHandler,
      useClass: WsGlobalErrorHandler
    },
    WsConfigurationService,
    // tslint:disable-next-line:max-line-length
    { provide: APP_INITIALIZER, useFactory: (config: WsConfigurationService) => () => config.getConfig(), deps: [WsConfigurationService], multi: true }
  ],
  exports: [RouterModule],
  entryComponents: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
