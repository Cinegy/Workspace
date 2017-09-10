import { WsMamConnection } from './../shared/services/ws-base-mam/ws-mam-connection';
export class WsConfiguration {
    public mams: WsMamConnection[];
    public domains: string[];
    public itemsPerPage: number;
}
