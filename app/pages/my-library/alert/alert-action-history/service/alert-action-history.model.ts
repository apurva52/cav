import { Cctx } from "src/app/shared/derived-metric/service/derived-metric.model";
import { Table } from "src/app/shared/table/table.model";
import {Events} from '../../service/alert-table.model';
import { AlertsTableHeader } from "../../service/alert-table.model";

export interface AlertActionHistoryTable extends Table {
    maxHierarchy?: number;
    headers?: AlertsTableHeader[];
    status: Status;
    data: ActionHistory[];
}

export interface ActionHistoryRequest {
	cctx?: Cctx;
    opType?: number;
	clientId?:string;
    appId?:string;
    ids ?: number[];
    actionsHistory?:any[];
    st: number;
    et: number;
   }

export interface ActionHistoryResponse {
	cctx?: Cctx;
    opType?: number;
	clientId?:string;
    appId?:string;
    actions?:ActionHistory[];   
}
export interface ActionHistory {
    id?: number;
    sequenceId ?:number;
    activeId?: number;
    createdTs?: number;
    alertTime?:number;
    creator?:string ;
    tr ?: number; 
    ruleId ?: number;
    ruleName ?: string;
    type ?: string;
    extensionName?:string;
    metrics?:any[];
    msg?: string;
	// name?: string;
	// createdTs?: number;
	// lastModifiedTs?: number;
	// creator?: string;
	// modifiedBy?: string;
	// attributes?: ActionHistoryAttributes;
}
// export interface ActionHistoryAttributes {
//     scheduleConfig?: ScheduleConfig;
// }
// export interface ScheduleConfig {
// 	fromHour?: number;
// 	toHour?: number;
// }
export interface Status {
	code?: number;
	msg?: string;
    detailedMsg?: string;
}
export interface FilteredActionHistoryWithTag{
    events?: Events[];
    tagging?: string;
}


