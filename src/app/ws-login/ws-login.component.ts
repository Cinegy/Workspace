import { WsConfigurationService } from './../ws-configuration/ws-configuration.service';
import { Component, OnInit } from '@angular/core';
import { WsConfiguration } from '../ws-configuration/ws-configuration';

@Component({
  selector: 'app-ws-login',
  templateUrl: './ws-login.component.html',
  styleUrls: ['./ws-login.component.css']
})
export class WsLoginComponent implements OnInit {
  mamList: WsConfiguration[];
  selectedMam: WsConfiguration;

  constructor(private configService: WsConfigurationService) {
    this.configService.getConfig()
    .subscribe(mamList => {
      this.mamList = mamList;

      if (this.mamList && this.mamList.length > 0) {
        this.selectedMam = this.mamList[0];
      }
    });
   }

  ngOnInit() {
  }

}
