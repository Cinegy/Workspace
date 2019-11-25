export interface JdfJob {
    created: Date;
    creator: NodeCreator;
    id: string;
    isDeleted: boolean;
    isDisabled: boolean;
    jobData: string;
    jobStatus: JdfJobStatus;
    modified: Date;
    modifier: NodeModifier;
    name: string;
    order: number;
    parent: string;
    type: string;
  }
  
  export interface NodeCreator {
    name: string;
  }
  
  export interface NodeModifier {
    name: string;
  }
  
  export interface JdfJobStatus {
    name: string;
    value: string;
  }
  