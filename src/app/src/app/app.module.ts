import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler, APP_INITIALIZER } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { WsLoginComponent } from './ws-login/ws-login.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule, MatInputModule, MatSelectModule, MatCardModule, MatSnackBarModule, MatNativeDateModule, MatIconRegistry, MatDialogModule, MatTabsModule, MatListModule, MatTooltipModule, MatMenuModule, MatIconModule, MatToolbarModule } from '@angular/material';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { WsAppStateService } from './ws-app-state.service';
import { WsConfigurationService } from './ws-configuration/ws-configuration.service';
import { RouterModule, Routes } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { WsGlobalErrorHandler } from './ws-global-error-handler';
import { WsBaseMamInterceptor } from './shared/services/ws-base-mam/ws-base-mam-interceptor';
import { WsClipboardService } from './ws-clipboard/ws-clipboard.service';
import { WsAppManagementService } from './ws-app-management.service';
import { WsDialogsModule } from './ws-dialogs/ws-dialogs.module';
import { WsCisLoginComponent } from './ws-cis-login/ws-cis-login.component';
import { LocalStorageModule } from 'angular-2-local-storage';
import { WsMainComponent } from './ws-main/ws-main.component';
import { DragulaModule, DragulaService } from 'ng2-dragula';
import { WsMainBreadcrumbsService } from './ws-main/ws-main-breadcrumbs.service';
import { WsExplorerService } from './ws-explorer/ws-explorer.service';
import { WsAuthGuardService } from './ws-login/ws-auth-guard.service';
import { WsMainModule } from './ws-main/ws-main.module';
import { WsLogoutComponent } from './ws-logout/ws-logout.component';
import { WsCisLoginModule } from './ws-cis-login/ws-cis-login.module';
import { WsLogoutModule } from './ws-logout/ws-logout.module';
import { WsLoginModule } from './ws-login/ws-login.module';
import { WsMainMenuModule } from './ws-main-menu/ws-main-menu.module';
import { WsNewsComponent } from './ws-news/ws-news.component';
import { WsRundownComponent } from './ws-news/ws-rundown/ws-rundown.component';
import { WsStoryPoolComponent } from './ws-news/ws-story-pool/ws-story-pool.component';
import { WsStoryComponent } from './ws-story/ws-story.component';



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
    AppComponent,

   
 
  ],
  imports: [
    RouterModule.forRoot(
      appRoutes,
    { useHash: false },
     
    ),
    LocalStorageModule.forRoot({
      prefix: 'cinegy-workspace',
      storageType: 'localStorage'
    }),
    BrowserModule,
    BrowserAnimationsModule,
    WsDialogsModule,
    DragulaModule,
    WsMainModule,
    WsCisLoginModule,
    WsLogoutModule,
    WsLoginModule,
    WsMainMenuModule

  ],
  exports: [RouterModule
  ],
  providers: [
    WsAppStateService,
    WsAppManagementService,
    WsClipboardService,
    CookieService,
    MatIconRegistry,
    WsMainBreadcrumbsService,
    WsExplorerService,
    DragulaService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: WsBaseMamInterceptor,
      multi: true
    },
    {
      provide: ErrorHandler,
      useClass:WsGlobalErrorHandler
    },
    WsConfigurationService,
    // tslint:disable-next-line:max-line-length
    { provide: APP_INITIALIZER, useFactory: (config: WsConfigurationService) => () => config.getConfig(), deps: [WsConfigurationService], multi: true }
  ],

  entryComponents: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
