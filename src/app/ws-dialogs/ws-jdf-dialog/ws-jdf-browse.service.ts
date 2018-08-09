import { Subject } from 'rxjs/Subject';
import { Injectable } from '@angular/core';
import { WsBaseMamService } from '../../shared/services/ws-base-mam/ws-base-mam.service';
import { WsAppStateService } from '../../ws-app-state.service';
import { HttpClient } from '@angular/common/http';

@Injectable()
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
    this.get(`${this.appState.selectedMam.mamEndpoint}node/list?parentId=${parentId}&filter=notDeleted&linksScope=self&linksScope=children&linksScope=metadata&take=10000&skip=0`, this.getChildrenSubject);
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
