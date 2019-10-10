import { Component, OnInit, OnDestroy } from '@angular/core';
import { WsMamError } from '../shared/services/ws-base-mam/ws-mam-error';
import { Subject } from 'rxjs/Rx';
import { WsAppStateService } from '../ws-app-state.service';
import { WsNewsService } from './ws-news.service';
import { MatDatepickerInputEvent } from '@angular/material';
import { Moment } from 'moment';

@Component({
  selector: 'app-ws-news',
  templateUrl: './ws-news.component.html',
  styleUrls: ['./ws-news.component.css']
})
export class WsNewsComponent implements OnInit ,OnDestroy{
  public subscribers: any[];
  public lastOpenedNode: any;
  public loading = false;
  public dates: any[] = [];
  public dictionary: [any, any] [] = [];
  // public dict : Dictionary<[any,any]>;
  public stories: any[] =[]
  
  public pushRundownSubject: Subject<any> = new Subject<any>();
  public resetRundownSubject: Subject<any> = new Subject<any>();
  
  public pushStoriesSubject: Subject<any> = new Subject<any>();
  public resetStoriesSubject: Subject<any> = new Subject<any>();
  
  constructor(
    public appState: WsAppStateService,
    public newsService: WsNewsService
    ) {
      console.log("Constructor call"); 
      this.subscribers = [];
      
      let subscriber = this.appState.selectNodeSubject
      .subscribe(response => this.selectNodeResponse(response));
      this.subscribers.push(subscriber);
      
      subscriber = this.appState.openNewsNodeSubject
      .subscribe(response => this.openNodeResponse(response));
      this.subscribers.push(subscriber);
      
      subscriber = this.newsService.getNewsSubject
      .subscribe(response => this.getParentResponse(response));
      this.subscribers.push(subscriber);
      
      subscriber = this.newsService.getChildrenSubject
      .subscribe(response => this.getChildrenResponse(response));
      this.subscribers.push(subscriber);

      subscriber =this.newsService.getMetaDataSubject.subscribe()
      this.subscribers.push(subscriber);

      subscriber = this.appState.resetModuleSubject
      .subscribe(
        ()=>this.resetModule()
      )
  }
  
  ngOnInit() {
    
  }

  ngOnDestroy(): void {
    this.subscribers.forEach(sub=>sub.unsubscribe());
  }
  /* Responses */
  private selectNodeResponse(response:any){
    if (response instanceof WsMamError) {
      return;
    }
  }

  private openNodeResponse(response: any) {
    if (response instanceof WsMamError) {
      console.log("Error on this cond");
      this.lastOpenedNode = null;
      return;
    }

    console.log('openNodeResponse');
    
    
    this.loading = true;
    this.newsService.getNews(response.id, response.type);
  }

  private getParentResponse(response:any){
    this.loading = false;
    if (response instanceof WsMamError) {
      console.log("Error on this cond");
      this.lastOpenedNode = null;
      return;
    }
    console.log('getParentResponse');
    this.lastOpenedNode = response;
    this.loading = true;
    console.log(this.lastOpenedNode);
    this.newsService.getChildren(this.lastOpenedNode.id, this.lastOpenedNode.type);
  }

  private getChildrenResponse(response:any){
    this.loading = false;

    if (response instanceof WsMamError) {
      console.log("Error on this cond");
      this.lastOpenedNode = null;
      return;
    }

    
    this.loading = true;

    response.items.forEach(element => {
      if(element.type=='year'){
        this.newsService.getChildren(element.id,element.type);
      }else if(element.type == 'month'){
        this.newsService.getChildren(element.id,element.type);
      }else if(element.type =='dayFolder'){
        this.writeDictionaryKeys(element);
        this.newsService.getChildren(element.id,element.type);
      }else if(element.type == 'bulletin'){        
        this.writeDictionaryValues(element);
      }else if(element.type == 'pool'){
        this.pushStoriesSubject.next(element);
      }
      else if(element.type =='rundownFolder'){
        this.pushRundownSubject.next(element);
      }
      else{
        console.log(element);
      }
    });
  }

  /*Utilities*/
  private writeDictionaryKeys(date):void{
    let keyPair = this.dictionary.find(pair=>{
      return pair[0].id == date.id;
    })
    
    if(!keyPair){
      this.dictionary.push([date,null]);
    }else{
      console.log("Key exists");
    }
  }

  private writeDictionaryValues(bulletin):void  {
    let pair = this.dictionary.find(element=>{
      return element[0].id==bulletin.parent;
    })

    if(pair){
      console.log("Found pair");
      pair[1] = bulletin;
    }
  }

  private resetModule(){
      this.dictionary.splice(0);
      this.resetComponents();
  }

  private resetComponents(){
    this.resetStoriesSubject.next();
    this.resetRundownSubject.next();
  }

  /* Page events*/
  public pickDateEvent(type:string, event:MatDatepickerInputEvent<Moment>){
    let mom:Moment = event.value;
    let currentDate:string =`${mom.date()}.${mom.month()+1}.${mom.year()}`; 
    console.log(`${mom.date()}.${mom.month()+1}.${mom.year()}`);
    
    let pair = this.dictionary.find(element=>{
      return element[0].name==currentDate
    })
    
    if(pair){
      this.resetComponents()
      this.newsService.getChildren(pair[1].id,pair[1].type);
    }else{
      this.resetComponents();
      console.log("Pair empty");
    }
  }
}
