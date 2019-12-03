import { Component, OnInit, OnDestroy } from '@angular/core';
import { WsMamError } from 'src/app/shared/services/ws-base-mam/ws-mam-error';
import { RundownNode } from '../RunDownNode';
import { WsNewsComponent } from '../ws-news.component';
import { WsNewsService } from '../ws-news.service';

@Component({
  selector: 'app-ws-rundown',
  templateUrl: './ws-rundown.component.html',
  styleUrls: ['./ws-rundown.component.css']
})
export class WsRundownComponent implements OnInit,  OnDestroy{
  
  public subscribers: any[]=[];
  public rundowns: any[];
  public currentRundownStories: any[];
  public lastOpenedNode: any;
  public loading = false;
  public tabs:RundownNode[];
  
  constructor(private newsComponent:WsNewsComponent,private newsService:WsNewsService) {
    this.currentRundownStories=[];
    this.tabs = [];
    let subscriber = this.newsComponent.pushRundownSubject
      .subscribe(response =>this.pushRundownResponse(response));
      this.subscribers.push(subscriber);

    subscriber = this.newsService.getRundownContentSubject
    .subscribe(response => this.getRundownContentResponse(response));
    this.subscribers.push(subscriber);

    subscriber = newsComponent.resetRundownSubject
    .subscribe(() =>this.resetRundownResponse());
    this.subscribers.push(subscriber);
  }
  ngOnInit(): void {
   
  }
  ngOnDestroy(){
    this.subscribers.forEach(element => {
      element.unsubscribe();
    });
  }

  private pushRundownResponse(response:any){
    if (response instanceof WsMamError) {
      console.log("Error on this cond");
      return;
    }
    let tab: RundownNode = new RundownNode();
    tab.parent = response;
    tab.children = [];
    this.tabs.push(tab);

    this.newsService.getRundownContent(response.id,response.type);
  }

  private getRundownContentResponse(response:any){
    if (response instanceof WsMamError) {
      console.log("Error on this cond");
      this.lastOpenedNode = null;
      return;
    }

    response.items.forEach(story => {
      
      this.tabs.forEach(node=>{
        if(node.parent.id==story.parent){
          node.children.push(story);
          node.childCount = node.children.length;
        }
      })
    });

    this.currentRundownStories = this.tabs[0].children;
  }

  private resetRundownResponse(){
    this.tabs.splice(0);
  }

}
