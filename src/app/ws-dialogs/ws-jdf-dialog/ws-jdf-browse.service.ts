import { Injectable } from '@angular/core';
import { WsBaseMamService } from 'src/app/shared/services/ws-base-mam/ws-base-mam.service';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { WsAppStateService } from 'src/app/ws-app-state.service';

@Injectable({
  providedIn: 'root'
})
export class WsJdfBrowseService extends WsBaseMamService {
  public getChildrenSubject: Subject<any> = new Subject<any>();
  public createJobSubject: Subject<any> = new Subject<any>();
  public getJobStatesSubject: Subject<any> = new Subject<any>();

  constructor(
    protected httpClient: HttpClient,
    protected appState: WsAppStateService) {
    super(httpClient, appState);
  }

  public getChildren(parentId: string) {
    // tslint:disable-next-line:max-line-length
    this.get(`${this.appState.selectedMam.mamEndpoint}node/list?parentId=${parentId}&filter.requestType=notDeleted&linksScope=self&linksScope=children&linksScope=metadata&take=10000&skip=0`, this.getChildrenSubject);
  console.log("parentID : "+ parentId);
  }

  public createJob(jobDropTarget: string, sourceNode: any, jobState: any) {
    // tslint:disable-next-line:max-line-length
    this.put(`${this.appState.selectedMam.mamEndpoint}job?parentId=${jobDropTarget}&jobSubject=${sourceNode.id}`, {Name: sourceNode.name, Status: jobState.value, JobData: ''}, this.createJobSubject);
  }

  public getJobStates() {
    // tslint:disable-next-line:max-line-length
    this.get(`${this.appState.selectedMam.mamEndpoint}job/statuses`, this.getJobStatesSubject);
  }
}
