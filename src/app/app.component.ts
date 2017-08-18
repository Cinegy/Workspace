import { Observable } from 'rxjs/Observable';
import { WsConfigurationService } from './ws-configuration/ws-configuration.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor() { }

  public ngOnInit() {
    console.log('*** Application started ***');
  }
}
