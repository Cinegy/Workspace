import { PageEvent } from "@angular/material/paginator";

export class RundownNode{
    public parent:any;
    public children: any[];
    public childCount: number;
    public pageEvent: PageEvent;
}