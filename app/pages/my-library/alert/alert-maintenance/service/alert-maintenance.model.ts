import { Table } from "src/app/shared/table/table.model";
import { ScheduleConfig, Status } from "../../alert-rules/alert-configuration/service/alert-config.model";
import { Cctx, Subject } from "../../service/alert.model";


export interface MaintenanceTable extends Table {
	data?: Maintenance[];
	status?:Status;
}

export interface MaintenanceRequest {
	opType?: number;
	//cctx?: ClientCTX;
	cctx?: Cctx;
	clientId?: string;
	appId?: string;
	maintenances?: Maintenance[];
}

export interface MaintenanceResponse {
	opType?: number;
	/* opType?: number;
	//cctx?: ClientCTX;
	cctx?: Cctx;
	clientId?: string;
	appId?: string; */
	configStatus?: ConfigStatus[];
	maintenances?: Maintenance[];
	status?: Status;
}

export interface ConfigStatus{
    id?:number,
    name?: string,
    status?:Status
}

export interface Maintenance {
	id?: number;
	name?: string;
	createdTs?: number;
	lastModifiedTs?: number;
	creator?: string;
	modifiedBy?: string;
	attributes?: MaintenanceAttributes;
}

export interface MaintenanceAttributes {
	subject?: Subject;
	tagInfo?: String;
	scheduleConfig?: ScheduleConfig;
	description?: string;
	mail?: string;
}

export interface HirarchyIndicesData {
	indicesLevelList?: IndicesLevelList[];
	label?: string;
	metaLabel?: string;
	selectedValue?: string;
}

export interface IndicesLevelList {
	metaData?: string;
	label?: string;
	value?: any; 
}