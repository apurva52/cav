import { Table, TableHeaderColumn } from 'src/app/shared/table/table.model';
import { Cctx, Status, Subject } from './alert.model';

export interface AlertsTableHeaderCols extends TableHeaderColumn {
  severityColorField?: boolean;
  severity?: boolean;
		st?: boolean;
		timeAgo?: boolean;
		tagInfo?: boolean;
		filters?: Filter;
}

export interface Filter{
	filter?: boolean;
	type?: string;
}

export interface AlertsTableHeader {
  cols: AlertsTableHeaderCols[];
}
export interface AlertsTable extends Table { 
  iconsField?: any;
  buttonField?: boolean;
  headers?: AlertsTableHeader[];
  severityCondition?: any;
  data?: FilteredEventsWithTag[];
		maxHierarchy?: number;
		status?: Status;
		severities?: Severity[];
		counter?: EventCounts[];
}

export interface Severity{
		name?: string;
		key?: string;
		color?: string;
		selected?: boolean;
		showInLegend?: boolean;
}

export interface FilteredEventsWithTag{
	 events?: Events[];
		tagging?: string;
		/* totalRecords?: number;
		loading?: boolean; */
}

//----------Active Alert Interface---------------------
export interface EventResponse {
	events?: Events[];
	filterdEvents?: FilteredEventsWithTag[];
 counter?: EventCounts[];
	status?: Status;
	maxHierarchy?: number;
}

export interface RowGroupInfo {
	metaDataName?: string;
	index?: number;
	size?: number;
}

export interface EventRequest {
	cctx?: Cctx;
	events?: Events[];
	opType?: number;
  counter?: EventCounts[];
  eventQuery?: EventQuery;
	status?: Status;
}

export interface EventQuery {
  severity?: number[];
  prevSeverity?: number[];
  st?: number;
  et?: number;
}

export interface EventCounts{
  name?: string;
  count?: number;
}

export interface Events{
	id?: number;
	sequenceId?: number;
	tr?: number;
	ruleId?: number;
	type?: number;
	ruleName?: string;
	msg?: string;
	description?: string;
	recomendation?: string;
	ack?: boolean;
  st?: any;
	et?: any;
	chkStatus?: number;	
  timeWindow?: number;
	severity?: string;
	prevSeverity?: string;
	currentValue?: string;
	prevValue?: string;
	modified?: boolean;
	state?: string;
	reason?: string;
	sourceProtocol?: string;
	sourceIP?: string;
	sourcePort?: string;
	rTags?: CommonEventInfo[];
	subject?: Subject;
	tagInfo?: string;
	metrics?: Metric[];
	conditions?: Conditions;
}

interface Metric {
	name?: string;
	measure?: GraphMeasure;
	subject?: Subject[];
	value?: number;
}

interface GraphMeasure{
	metric?: string;
	metricId?: number;
	mg?: string;
	mgId?: number;
	mgType?: string;
	mgTypeId?: number;
}

export interface CommonEventInfo{
	id?: number;
	name?: string;
}

export interface Duration{
	st?: number;
	et?: number;
	chkAlertStatus?: number;
}

export interface Measure{
	metric?: string;
	metricid?: number;
	mg?: string;
	mgid?: number;
	mgType?: string;
	mgTypeid?: number;
}

export interface Conditions{
	condition?: string;
	conditionList?: ConditionList[];
}

export interface ConditionList{
	id?: number;
	name?: string;
	mName?: string
	Type?: string;
	thresholdType?: ThresholdType;
	advance?: Advance;
	recovery?: Recovery;
	anomalyType?: AnomalyType;
	outlierType?: OutlierType;
	forcastType?: ForcastType;
}

export interface ThresholdType{
    mName?:string;
	dataType?: number;
	operator?: number;
	fThershold?: number;
	sThershold?: number;
}

export interface Advance{
   sPct?: number;
}

export interface Recovery{
	fThershold?: number;
	sThershold?: number;
}

export interface AnomalyType{
	mName?: string;
	operator?: number;
}

export interface OutlierType{
	mName?: string;
	algoType?: number;
	tolerance?: number;
}

export interface ForcastType{
	mName?: string;
	operator?: number;
	fThershold?: number;
	sThershold?: number;
}
