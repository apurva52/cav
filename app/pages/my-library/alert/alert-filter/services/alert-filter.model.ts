import { Cctx, Status, Subject } from "../../service/alert.model";
import { Events, EventResponse } from "../../service/alert-table.model";
import * as CONS from './../../alert-constants'
export class SeverityFilter
{
    reason: number = CONS.STATUS.STARTED;
    severity: number = CONS.SEVERITY.NORMAL;
    prevSeverity: number = CONS.SEVERITY.NORMAL;
}

export class EventQuery
{
    ruleNames: any[] = [];
    others: any[] = [];
    severityFilter: SeverityFilter[] = [];
    //private Subject subject;
    st: number = -1;
    et: number = -1;
    subject: Subject;
}

export class EventHistoryRequest
{
    cctx: Cctx;
    opType: number = 0;
    clientId: string = '';
    appId: string = '';
    events: Events[] = [];
    eventQuery: EventQuery;
}