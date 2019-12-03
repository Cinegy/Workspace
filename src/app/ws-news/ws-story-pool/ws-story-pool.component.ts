import { Component, OnInit, OnDestroy } from '@angular/core';
import { WsMamError } from 'src/app/shared/services/ws-base-mam/ws-mam-error';
import { WsNewsComponent } from '../ws-news.component';
import { WsNewsService } from '../ws-news.service';

@Component({
  selector: 'app-ws-story-pool',
  templateUrl: './ws-story-pool.component.html',
  styleUrls: ['./ws-story-pool.component.css']
})
export class WsStoryPoolComponent implements OnInit , OnDestroy {
  public subscribers: any[]=[];
  public stories:any[];
  public loading = false;

  constructor(private newsComponent:WsNewsComponent,private newsService:WsNewsService) { 
    this.stories = newsComponent.stories;

    let subscriber = this.newsComponent.pushStoriesSubject
      .subscribe(response=>this.pushStoriesResponse(response));
      this.subscribers.push(subscriber);
    subscriber = newsComponent.resetStoriesSubject
      .subscribe(()=>this.resetPoolResponse());
      this.subscribers.push(subscriber);
    subscriber = this.newsService.getPoolContentSubject
      .subscribe(response=> this.getPoolContentResponse(response));
      this.subscribers.push(subscriber);
  }

  ngOnInit() {
  }

  ngOnDestroy(){
    this.subscribers.forEach(element => {
      element.unsubscribe();
    });
  }
  
  private pushStoriesResponse(response: any){
    if (response instanceof WsMamError) {
      console.log("Error on this cond");
      return;
    }

    this.newsService.getPoolContent(response.id,response.type);
  }

  private getPoolContentResponse(response:any){
    this.loading = false;

    if (response instanceof WsMamError) {
      console.log("Error on this cond");
      return;
    }
    response.items.forEach(element => {
      if(element.type=='story'){
        this.stories.push(element);
      }
    });
  }

  private resetPoolResponse(){
    this.stories.splice(0);
  }
}
