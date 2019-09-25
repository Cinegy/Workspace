import { Component, OnInit, OnDestroy } from '@angular/core';
import { WsAppStateService } from '../ws-app-state.service';
import { WsCisService } from '../shared/services/ws-cis/ws-cis.service';


@Component({
  selector: 'app-ws-cis-login',
  templateUrl: './ws-cis-login.component.html',
  styleUrls: ['./ws-cis-login.component.css']
})
export class WsCisLoginComponent implements OnInit,OnDestroy {
  private subscribers: any[];
  public isConnectionSpinnerHidden = true;
  public errorMsg = [];
  constructor(
    private appState:WsAppStateService,
    private cisService:WsCisService
  ) {
    this.subscribers=[];
  }

  ngOnInit() {
  }
  ngOnDestroy(){
    this.subscribers.forEach(element=>{element.unsubscribe();
    });
  }
public onSubmit(){
  this.errorMsg=[];
  this.appState.setConnectionState(false,null);
  this.isConnectionSpinnerHidden=false;
  this.cisService.startAuthentication();
}

}
