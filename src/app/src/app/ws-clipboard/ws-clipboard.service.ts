import { Injectable } from '@angular/core';

@Injectable()
export class WsClipboardService {
  private _clipboardItems: any[];
  public action: ClipboardAction;

  constructor() {
    this._clipboardItems = [];
   }

   public get items(): any[] {
     return this._clipboardItems;
   }

   public add(item: any): void {
     this._clipboardItems.push(item);
   }

   public remove(item: any): void {
     if (item == null) {
       return;
     }

     const index = this._clipboardItems.findIndex( i => i === item);
     this._clipboardItems.splice(index, 1);
   }

   public done(): void {
     this._clipboardItems = [];
   }

   public cancel(): void {
     this._clipboardItems = [];
   }

}

export enum ClipboardAction {
  Cut,
  Copy,
  Delete,
  Paste
}

