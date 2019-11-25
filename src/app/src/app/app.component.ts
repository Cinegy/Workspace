import { Component, OnInit, OnDestroy } from '@angular/core';
import { WsAppStateService } from './ws-app-state.service';
import { WsConfigurationService } from './ws-configuration/ws-configuration.service';
import { Router } from '@angular/router';
import { WsAppManagementService } from './ws-app-management.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {

  title = 'WorkSpace';
  private subscribers: any[];
  constructor(
    private appState: WsAppStateService,
    private management: WsAppManagementService,
    private config: WsConfigurationService,
    private router: Router) {
    this.subscribers = [];

    }
    ngOnInit() {
    console.log("***Application started***");
    const subscriber=this.appState.loggedInSubject
    .subscribe(response=>this.loginResponse(response));
    this.appState.itemsPerPage=this.config.configuration.itemsPerPage;
    }
  ngOnDestroy() {
    this.subscribers.forEach(element=>{
      element.unsubscribe();

    });
  }
  private loginResponse(response:any){
this.management.initialize();
this.router.navigate(['/main']);
  }
  
}
