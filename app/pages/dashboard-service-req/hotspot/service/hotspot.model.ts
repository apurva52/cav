import { ChartConfig } from 'src/app/shared/chart/service/chart.model';
import { Table, TableHeaderColumn } from 'src/app/shared/table/table.model';
import { TableBoxTable } from 'src/app/pages/dashboard-service-req/ip-summary/table-box/service/table-box.model';

export interface HotspotData {
  panels: HotspotPanel[];
}
export interface StackTraceData {
  panels: StackTracePanel[];
}

export interface HsIpCallsData {
  panels: HsIpPanel[];
  indBtPopupData : TableBoxTable[];
}

export interface HotspotTableHeaderCols extends TableHeaderColumn {}
export interface StackTraceHeaderCols extends TableHeaderColumn {}
export interface HsIpTableHeaderCols extends TableHeaderColumn {
  severityColorField?: boolean;
}

export interface HotspotTableHeader {
  cols: HotspotTableHeaderCols[];
}
export interface StackTraceTableHeader {
  cols: StackTraceHeaderCols[];
}
export interface IpCallsTableHeader {
  cols: HsIpTableHeaderCols[];
}

export interface HotspotPanel extends Table {
  label: string;
  headers: HotspotTableHeader[];
  charts: ChartConfig[];
  collapsed?: boolean;
  menuOption?: boolean;
}
export interface StackTracePanel extends Table {
  label: string;
  headers: StackTraceTableHeader[];
  charts: ChartConfig[];
  collapsed?: boolean;
  menuOption?: boolean;
}

export interface HotspotLoadPayload {}
export interface HsIpPanel extends Table {
  label: string;
  collapsed?: boolean;
  menuOption?: boolean;
}
