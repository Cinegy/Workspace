import { WsMainBreadcrumbsService } from './ws-main-breadcrumbs.service';
import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/components/common/menuitem';

@Component({
  selector: 'app-ws-main',
  templateUrl: './ws-main.component.html',
  styleUrls: ['./ws-main.component.css']
})
export class WsMainComponent implements OnInit {

  constructor(
    public breadcrumbService: WsMainBreadcrumbsService
  ) { }

  ngOnInit() {
    this.breadcrumbService.reset();
  }

}
