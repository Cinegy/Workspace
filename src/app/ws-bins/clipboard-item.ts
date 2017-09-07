import { BinNode } from './bin-node';
export class ClipboardItem {
    public bin: BinNode;
    public item: any;
    public action: ClipboardAction;
}

export enum ClipboardAction {
    Cut,
    Copy,
    Delete,
    Paste
}
