import { WsMamConnection, WsCisConfiguration } from '../shared/services/ws-base-mam/ws-mam-connection';

export class WsConfiguration {
    public mams: WsMamConnection[];
    public cis: WsCisConfiguration;
    public domains: string[];
    public itemsPerPage: number;
    public useRemoteConfig: boolean;
    public remoteConfigHost: string;
    public readonly major = '19';
    public readonly minor = '9';
    public readonly commit = '65535';
    public readonly build = '0';
    public readonly configVersion = 'v1.0';
    public readonly clientHost = location.hostname + ':' + location.port;
}
