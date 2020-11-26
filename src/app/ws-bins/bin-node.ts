import { PageEvent } from '@angular/material/paginator';

export class BinNode {
  public parent: any;
  public children: any[];
  public childCount: number;
  public pageEvent: PageEvent;
  public DefaultBinType: string = null;
}
