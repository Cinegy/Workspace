export class WsUploadStoreModel {
    public content: WsUploadStoreContentItem[];
  
    constructor() {
      this.content = [];
    }
  }
  
  export class WsUploadStoreContentItem {
    public name: string;
    public size: number;
  }
  