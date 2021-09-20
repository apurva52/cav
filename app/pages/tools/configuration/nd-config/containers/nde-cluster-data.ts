export class NDE {
    id: number;
    name: any;
    ip: any;
    port: any;
    isMaster: any;
    wsPort: any;
    wssPort: any;
    dupEntryMsg: string;
}

export class NDERoutingRules {
    id: number;
    nde: NDE;
    tierGroup: any;
    dupEntryMsg: string;

}
