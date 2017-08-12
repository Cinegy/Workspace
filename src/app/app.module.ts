import 'hammerjs';
import { WsLoginComponent } from './ws-login/ws-login.component';
import { WsConfigurationModule } from './ws-configuration/ws-configuration.module';
import { WsLoginModule } from './ws-login/ws-login.module';
import { WsMainMenuModule } from './ws-main-menu/ws-main-menu.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { WsConfiguration } from './ws-configuration/ws-configuration';
import { RouterModule, Routes } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';

const appRoutes: Routes = [
  { path: 'login', component: WsLoginComponent },
  { path: '',
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
    WsConfigurationModule,
    WsMainMenuModule,
    WsLoginModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
