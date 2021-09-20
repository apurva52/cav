import { Table } from "src/app/shared/table/table.model";
import { AlertsTableHeader } from "../../service/alert-table.model";
import { Cctx, Status, Subject } from "../../service/alert.model";


export interface ActionTable extends Table {
	data?: Action[];
    headers?: AlertsTableHeader[];
    cctx?: Cctx;
    opType?: number;
    actions?: Action[];
    status?: Status;
    paginator?: any;
    extensions?: any[];
}

export class ActionType {
	type?: number = -1;
    email?: Email;
    sms?: SMS;
    chart?: Chart;
    report?: Report;
    snmp?: SNMP;
    threadDump?: DiagnosticDump;
    heapDump?: DiagnosticDump;
    cpuProfiling?: DiagnosticDump;
    tcpDump?: TcpDump;
    command?: Command;
    jfr?: JFR;
    extensionName?: string = "";
    indicesPattern?: string = "";
}

export class Action {
	id?: number = -1;
	name?: string = "";
    actions?: ActionType[] = []//new ActionType();
}

export class Extension {
    classPath?: string;
    displayName?: string;
    extName?: string;
}


export interface ActionRequest {
	opType?: number;
	//cctx?: ClientCTX;
	cctx?: Cctx;
	clientId?: string;
	appId?: string;
    ids?: number; 
	actions?: Action[];
}

export interface ActionResponse {
	opType?: number;
	//cctx?: ClientCTX;
	cctx?: Cctx;
	clientId?: string;
	appId?: string; 
	actions?: Action[];
    extensions?: Extension[];
    configStatus?: ConfigStatus[]
}

export interface ConfigStatus{
    id?:number,
    name?: string,
    status?:Status
}

export class Chart {
    enable?: boolean = false;
    type?: number = -1;
    duration?: number = -1;
    allGraphs?: boolean = false;
    singleGraph?: boolean = false;
    pattern?: boolean = false;
    maxBaseline?: boolean = false;
    catalogueName?: String = "";
    maxNumOfChart?: number = -1;
    inversePattern?: boolean = false;
    threshold?: number = -1;
}

export class Command {
    type?: number = -1;
    name?: String = "";
    script?: String = "";
    runOnServer?: number = -1;
}

export class DiagnosticDump{
    execute?: number = 2;
    interval?: number = 10;
    timeout?: number = 5;
}

export class Email {
    receiver?: String = "";
    subject?: String = "$SEVERITY : $PRODUCT_NAME $ALERT_TYPE Alert for one of the severely affected indices '$INDICES'";
    preText?: String = "";
    postText?: String = "";
    dashboardLink?: String = "";
    dashboardGraphTime?: number = -1;
    singleWidget?: boolean = false;
}

export class JFR {
    sTime?: number = -1;
    sTimePrefix?: String = "";
    path?: String = "";
    fileSize?: number = -1;
    fileSizePrefix?: String = "";
    timeout?: number = -1;
    timeOutPrefix?: String = "";
}

export class Report {
    enable?: boolean = false;
    type?: String = "";
    duration?: number = -1;
    chartInclude?: boolean = false;
    allGraph?: boolean = false;
    chartType?: String = "";
    fromUserGraph?: boolean = false;
    favOrTempType?: String = "";
    favOrTempName?:String = "";
    attachment?: boolean = false; 
    metricsType?: string = "";
}

export class SMS {
    receiver?: String = "";
}

export class SNMP {
    ruleLevel?: number = -1;
    server?: String = "";
    port?: number = -1;
    sender?: String = "";
    version?: number = -1;
    level?: number = -1;
    user?: String = "";
    authPass?: String = "";
    privPass?: String = "";
    authProtocol?: number = -1;
    privProtocol?: number = -1;
    community?: String = "";
}

export class TcpDump {
    interfaceName?: String = "";
    command?: String = "";
    duration?: number = -1;
    fileSize?: number = -1;
    port?: number = -1;
    packetNum?: number = -1;
}

export interface ValueFlageProperty
{
  value: string;
  flage: boolean;
}

export interface MailCustomField
{
  value: string;
  label: string;
}

export interface actionListdataType
{
  label: string;
  value: string;
}

export interface booleanFlagProperty
{
  label: string;
  value: boolean;
}