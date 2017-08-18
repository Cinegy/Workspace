import { WsAuthGuardService } from './ws-login/ws-auth-guard.service';
import { WsExplorerModule } from './ws-explorer/ws-explorer.module';
import { WsExplorerComponent } from './ws-explorer/ws-explorer.component';
import { WsMainComponent } from './ws-main/ws-main.component';
import { WsMainModule } from './ws-main/ws-main.module';
import { WsAppStateService } from './ws-app-state.service';
import 'hammerjs';
import { WsLoginComponent } from './ws-login/ws-login.component';
import { WsConfigurationModule } from './ws-configuration/ws-configuration.module';
import { WsLoginModule } from './ws-login/ws-login.module';
import { WsMainMenuModule } from './ws-main-menu/ws-main-menu.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';

const appRoutes: Routes = [
  { path: 'login', component: WsLoginComponent },
  { path: 'main',
    component: WsMainComponent,
    canActivate: [WsAuthGuardService],
    children: [
      { path: 'explorer', component: WsExplorerComponent, outlet: 'routeLeftContainer' }
    ]
   },
  {
    path: '',
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
      appRoutes
      // { enableTracing: true } // <-- debugging purposes only
    ),
    BrowserModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    WsMainModule,
    WsConfigurationModule,
    WsMainMenuModule,
    WsLoginModule,
    WsExplorerModule
  ],
  providers: [
    WsAppStateService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
