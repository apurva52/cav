import { ChartConfig } from 'src/app/shared/chart/service/chart.model';
import { Table, TableHeaderColumn } from 'src/app/shared/table/table.model';

export interface HotspotData {
  panels: HotspotPanel[];
}
export interface StackTraceData {
  panels: StackTracePanel[];
}

export interface HotspotTableHeaderCols extends TableHeaderColumn {}
export interface StackTraceHeaderCols extends TableHeaderColumn {}

export interface HotspotTableHeader {
  cols: HotspotTableHeaderCols[];
}
export interface StackTraceTableHeader {
  cols: StackTraceHeaderCols[];
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
