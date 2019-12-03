import { Injectable } from '@angular/core';
import { WsBaseMamService } from '../shared/services/ws-base-mam/ws-base-mam.service';
import { Subject } from 'rxjs/Rx';
import { HttpClient } from '@angular/common/http';
import { WsAppStateService } from '../ws-app-state.service';

@Injectable({
  providedIn: 'root'
})
export class WsStoryService  extends WsBaseMamService{
  public getStorySubject : Subject<any> = new Subject<any>();
  public getStoryContentSubject : Subject<any> = new Subject<any>();
  public getScriptClipSubject : Subject<any> = new Subject<any>();
  

  constructor(
    protected httpClient: HttpClient,
    protected appState:WsAppStateService ) { 
      super(httpClient,appState)
    }

    public getStory(id:string,type:string){
      let fragment :string;
      switch(type){
        case 'story' :
          fragment = `node?id=${id}&f=full&linksScope=children&linksScope=metadata`
          break;
        case 'scriptClip':
          fragment = `node?id=${id}&f=full`
          break;
      }

      this.get(`${this.appState.selectedMam.mamEndpoint}${fragment}`, this.getStorySubject);
    }

    public getStoryContent(id:string,type:string){
      let fragment :string;
      switch(type){
        case 'story':
          fragment = `node/list?parentId=${id}`
          break;
        case 'layer':
          fragment =`node/list?parentId=${id}`
          break;
        case 'track':
          fragment = `node/list?parentId=${id}&f=3`;
          break;
      }
      // fragment = `node/list?parentId=${id}&f=3`;

      this.get(`${this.appState.selectedMam.mamEndpoint}${fragment}&filter.requestType=notDeleted&linksScope=self&linksScope=children&linksScope=metadata&take=10000&skip=0`, this.getStoryContentSubject);
    }

    public getScriptClipContent(id:string,type:string){
      let fragment= `node?id=${id}&filter.fillingType=full`

      this.get(`${this.appState.selectedMam.mamEndpoint}${fragment}&filter.requestType=notDeleted&linksScope=self&linksScope=children&linksScope=metadata&take=10000&skip=0`, this.getScriptClipSubject);
    }
}
