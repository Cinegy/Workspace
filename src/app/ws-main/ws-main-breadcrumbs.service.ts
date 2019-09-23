import { Injectable } from '@angular/core';
import { MenuItem } from 'primeng/primeng';
import { Subject } from 'rxjs/Subject';


@Injectable()
export class WsMainBreadcrumbsService {
  public breadcrumbs:MenuItem[];
  public breadcrumbClickedSubject:Subject<any>=new Subject<any>();

  constructor() { 
    this.breadcrumbs=[];
  }
  public reset(){
    this.breadcrumbs=[];
  }
  public add(node:any){
    this.breadcrumbs.push({
      label:node.name,
      
      command:(event)=>{
        this.clicked(event,node);
      }
    });    
  }
private clicked(event:any,node:any){
const end=this.breadcrumbs.indexOf(event.item);
this.breadcrumbs=this.breadcrumbs.slice(0,end);
this.breadcrumbClickedSubject.next(node);
  }
}
