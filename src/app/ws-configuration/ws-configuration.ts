import { WsMamConnection } from './../shared/services/ws-base-mam/ws-mam-connection';
export class WsConfiguration {
    public mams: WsMamConnection[];
    public domains: string[];
    public itemsPerPage: number;
    public useRemoteConfig: boolean;
    public remoteConfigHost: string;
    public readonly major = '11';
    public readonly minor = '0';
    public readonly commit = '0';
    public readonly build = '0';
    public readonly configVersion = 'v1.0';
    public readonly clientHost = location.hostname + ':' + location.port;
}
