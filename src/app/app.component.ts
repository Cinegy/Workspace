import { Observable } from 'rxjs/Observable';
import { WsConfigurationService } from './ws-configuration/ws-configuration.service';
import { Component, OnInit } from '@angular/core';
import { WsConfiguration } from './ws-configuration/ws-configuration';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(private configService: WsConfigurationService) { }

  public ngOnInit() {
  }
}
