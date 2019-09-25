import { Component, OnInit, OnDestroy } from '@angular/core';
import { WsMamError } from '../shared/services/ws-base-mam/ws-mam-error';
import { WsAppStateService } from '../ws-app-state.service';
import { WsMetadataService } from '../ws-metadata/ws-metadata.service';
import { WsStoryService } from './ws-story.service';

@Component({
  selector: 'app-ws-story',
  templateUrl: './ws-story.component.html',
  styleUrls: ['./ws-story.component.css']
})
export class WsStoryComponent implements OnInit , OnDestroy {
  public subscribers: any[];

  constructor(
    public appState:WsAppStateService,
    public storyService:WsStoryService,
    public metaDataService:WsMetadataService) {
      this.subscribers = [];

      let subscriber = appState.openStoryNodeSubject.subscribe(
        response=> this.openNodeResponse(response)
      )
      this.subscribers.push(subscriber);

      subscriber = this.appState.selectNodeSubject
      .subscribe(response => this.selectNodeResponse(response));
      this.subscribers.push(subscriber);

      subscriber = storyService.getStorySubject.subscribe(
        response => this.getStoryResponse(response)
      )
      this.subscribers.push(subscriber);

      subscriber = storyService.getStoryContentSubject.subscribe(
        response => this.getStoryContentResponse(response)
      )
      this.subscribers.push(subscriber);

      subscriber = storyService.getScriptClipSubject.subscribe(
        response => this.getScriptClipResponse(response)
      )
      this.subscribers.push(subscriber);

      subscriber = metaDataService.getDescriptorsSubject.subscribe(
        response=> this.getDescriptorResponse(response)
      )
      this.subscribers.push(subscriber);

      subscriber = metaDataService.getMetadataSubject.subscribe(
        response=> this.getMetadataResponse(response)
      )
      this.subscribers.push(subscriber);
    }

  ngOnInit() {
  }

  ngOnDestroy(){
    this.subscribers.forEach(sub=>sub.unsubscribe());
  }

  
  /*Responses*/
  private selectNodeResponse(response:any){
    if (response instanceof WsMamError) {
      return;
    }
  }
  
  private openNodeResponse(response:any){
    if (response instanceof WsMamError) {
      console.log("Error on this cond");
      // this.lastOpenedNode = null;
      return;
    }

    this.storyService.getStory(response.id,response.type);
  }

  private getStoryResponse(response:any){
    if (response instanceof WsMamError) {
      console.log("Error on this cond");
      // this.lastOpenedNode = null;
      return;
    }

    this.metaDataService.getMetadata(response);
    this.metaDataService.getDescriptors(response.type);
    this.storyService.getStoryContent(response.id,response.type);
  }

  private getStoryContentResponse(response:any){
    if (response instanceof WsMamError) {
      console.log("Error on this cond");
      // this.lastOpenedNode = null;
      return;
    }

    response.items.forEach(element => {
      if(element.name=="Text"){
        this.storyService.getStoryContent(element.id,element.type);
      }
      if(element.name=="Transcript"){
        this.storyService.getStoryContent(element.id,element.type);
      }
      if(element.type=="scriptClip"){
        this.storyService.getScriptClipContent(element.id,element.type);
      }
      // if(element.type="track" && element.name=="Transcript"){
      //   this.storyService.getStoryContent(element.id,element.type);
      //   //console.log(response);
      // }
    });
    // if(response.items.length>0)
    //console.log(response);
  }

  private getScriptClipResponse(response:any){
    if (response instanceof WsMamError) {
      console.log("Error on this cond");
      // this.lastOpenedNode = null;
      return;
    }

    //console.log(response);
  }

  private getDescriptorResponse(response:any){
    if (response instanceof WsMamError) {
      console.log("Error on this cond");
      // this.lastOpenedNode = null;
      return;
    }

    console.log(response);
  }

  private getMetadataResponse(response:any){
    if (response instanceof WsMamError) {
      console.log("Error on this cond");
      // this.lastOpenedNode = null;
      return;
    }

    console.log(response);
  }
}
