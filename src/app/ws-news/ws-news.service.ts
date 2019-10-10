import { Injectable } from '@angular/core';
import { WsBaseMamService } from '../shared/services/ws-base-mam/ws-base-mam.service';
import { Subject } from 'rxjs/Rx';
import { HttpClient } from '@angular/common/http';
import { WsAppStateService } from '../ws-app-state.service';

@Injectable({
  providedIn: 'root'
})
export class WsNewsService extends WsBaseMamService {
  public getNewsSubject : Subject<any> = new Subject<any>();
  public getChildrenSubject: Subject<any> = new Subject<any>();
  public getPoolContentSubject : Subject<any> = new Subject<any>();
  public getRundownContentSubject: Subject<any> = new Subject<any>();
  public getMetaDataSubject: Subject<any> = new Subject<any>();
  public createNodeSubject: Subject<any> = new Subject<any>();
  public childNode:any[];

  constructor(
    protected httpClient:HttpClient,
    protected appState:WsAppStateService ) {
      super(httpClient, appState);
     }
  
  public getNews(id : string, type: string){
    let fragment :string;
    switch(type){
      case 'newsProgram' :
        fragment = `node?id=${id}&linksScope=children&linksScope=metadata`
        break;
    }
    

    this.get(`${this.appState.selectedMam.mamEndpoint}${fragment}`, this.getNewsSubject);
  }

  public getChildren(id:string,type:string,take?:number,skip?: number){
    if (take === undefined) {
      take = this.appState.itemsPerPage;
    }

    if (skip === undefined) {
      skip = 0;
    }

    let fragment: string;
 
    switch(type){
      case 'newsProgram':
        fragment = `node/list?parentId=${id}`;
        break;
      case 'year' :
        fragment = `node/list?parentId=${id}`;
        break;
      case 'month':
        fragment = `node/list?parentId=${id}`;
        break;
      case 'dayFolder':
        fragment = `node/list?parentId=${id}`;
        break;
      case 'bulletin':
        fragment = `node/list?parentId=${id}`;
        break;
    }
    // &take=${take}&skip=${skip}
    // tslint:disable-next-line:max-line-length
    this.get(`${this.appState.selectedMam.mamEndpoint}${fragment}&filter.requestType=notDeleted&linksScope=self&linksScope=children&linksScope=metadata&take=10000&skip=0`, this.getChildrenSubject);
  }

  public getPoolContent(id:string,type:string,take?:number,skip?: number){
    if (take === undefined) {
      take = this.appState.itemsPerPage;
    }

    if (skip === undefined) {
      skip = 0;
    }

    let fragment: string;

    if(type=='pool'){
      fragment = `node/list?parentId=${id}`;
    }else{
      return;
    }

    this.get(`${this.appState.selectedMam.mamEndpoint}${fragment}&filter.requestType=notDeleted&linksScope=self&linksScope=children&linksScope=metadata&take=10000&skip=0`, this.getPoolContentSubject);
  }

  public getRundownContent(id:string,type:string,take?:number,skip?: number){
    if (take === undefined) {
      take = this.appState.itemsPerPage;
    }

    if (skip === undefined) {
      skip = 0;
    }

    let fragment: string;

    if(type=='rundownFolder'){
      fragment = `node/list?parentId=${id}`;
    }else{
      return;
    }

    this.get(`${this.appState.selectedMam.mamEndpoint}${fragment}&filter.requestType=notDeleted&linksScope=self&linksScope=children&linksScope=metadata&take=10000&skip=0`, this.getRundownContentSubject);
  }

  public getMetaData(id:string){
    
    this.get(`${this.appState.selectedMam.mamEndpoint}metadata?id=${id}`,this.getMetaDataSubject);
  }

  public createNode(parentId: string, nodeType: string, name: string) {
    this.put(
      `${this.appState.selectedMam.mamEndpoint}folder?parentId=${parentId}&type=${nodeType}`,
      { Name: name },
      this.createNodeSubject);
  }
}
