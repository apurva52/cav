import { Status } from "../../alert-rules/alert-configuration/service/alert-config.model";
import { ActionsEvents } from "../../alert-rules/service/alert-rules.model";
 import { Cctx } from "../../service/alert.model";


export interface ConfigRequest {
	opType?: number;
	//cctx?: ClientCTX;
	cctx?: Cctx;
    // clientId?: clientId;
    // appId?: appId;
    config?: Config;
	status?: Status;
}

export interface ConfigResponse {
	opType?: number;
	//cctx?: ClientCTX;
	cctx?: Cctx;
	config?: Config;
	status?: Status;
}

export interface Config {
    configId: number;
	name?: string;
    createdTs?: string;
	lastModifiedTs?: number;
	creator?: string;
	modifiedBy?: string;
    enable?: boolean;
    rSeverityLevel?: number;
    clearEvent?: boolean;
    restEvent?: boolean;
    clearRestEvent?: boolean;
    clearRestEventOnInterval?: boolean;
    clearRestEventInterval?: number;
    historyLog?: boolean;
    maintenance?: boolean;
    clrEventOnMaintenance?: number;
    minBaselineValue?: number;
    numSkipSampleOnSR?: number;
    graphTime?: number;
    autoScaleSkipDuration?: number;
    restApiTriggered?: boolean;
    clrRestApiTriggered?: number;
    actionsEvents?: ActionsEvents;
    policy?: PolicyConfigDTO;
    moduleLog?: ModuleLog[];
    validSamplePct?: number;
}

export interface ModuleLog{
    name?: string,
    level?: number
}

export interface PolicyConfigDTO{
            enablePolicy?: boolean,
            mail?: boolean,
            sms?: boolean,
            snmp?: boolean,
            threadDump?: boolean,
            heapDump?: boolean,
            tcpDump?: boolean,
            cpuProfile?: boolean,
            jfr?: boolean,
            runScript?: boolean,
            extension?: boolean,
            snapshot: boolean,
            runOnServer:boolean;
}