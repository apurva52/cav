import * as CONS from './alert-constants'
export class SeverityFilter
{
    reason: number = CONS.STATUS.STARTED;
    severity: number = CONS.SEVERITY.NORMAL;
    prevSeverity: number = CONS.SEVERITY.NORMAL;
}

export class EventQueryRequest
{
    ruleNames: any[] = [];
    others: any[] = [];
    severityFilter: SeverityFilter[] = [];
    //private Subject subject;
    st: number = -1;
    et: number = -1;

}