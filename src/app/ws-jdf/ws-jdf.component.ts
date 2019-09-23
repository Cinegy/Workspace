import { JdfJob } from './ws-jdf-job';
import { WsJdfService } from './ws-jdf.service';
import { WsAppStateService } from '../ws-app-state.service';
import { Component, OnInit, AfterViewInit, OnDestroy, Input, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import * as DateFormat from 'dateformat';
import { MatTabGroup } from '@angular/material';

@Component({
  selector: 'app-ws-jdf',
  templateUrl: './ws-jdf.component.html',
  styleUrls: ['./ws-jdf.component.css']
})
export class WsJdfComponent implements OnInit, AfterViewInit, OnDestroy {
  private subscribers: any[];
  public jdfNode: any;
  public jobs: JdfJob[];
  public displayedColumns = ['name', 'jobStatus', 'created', 'createdBy'];
  public dataSource: MatTableDataSource<JdfJob>;

  @Input() tabGroup: MatTabGroup;
  @ViewChild( MatPaginator,{static:false}) paginator:MatPaginator;

  constructor(public appState: WsAppStateService, private jdfService: WsJdfService) {
    this.jobs = [];

    this.dataSource = new MatTableDataSource<JdfJob>(this.jobs);

    this.subscribers = [];
    let subscriber = this.appState.openJdfNodeSubject
      .subscribe(jdfNode => this.openJdfNodeResponse(jdfNode));
    this.subscribers.push(subscriber);

    subscriber = this.jdfService.getJdfSubject
      .subscribe(jobs => this.getJdfResponse(jobs));
    this.subscribers.push(subscriber);
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnDestroy() {
    this.subscribers.forEach(element => {
      element.unsubscribe();
    });
  }

  public dateFormat(date: Date): string {
    if (date) {
      return DateFormat(date);
    } else {
      return '';
    }
  }

  /* *** Subscriptions *** */
  private openJdfNodeResponse(jdfNode: any): void {
    this.tabGroup.selectedIndex = 1;
    this.jdfNode = jdfNode;
    this.jdfService.getJdf(this.jdfNode);
  }

  private getJdfResponse(jobs: any): void {
    this.jobs = jobs.items;
    this.dataSource.data = this.jobs;
  }

}


