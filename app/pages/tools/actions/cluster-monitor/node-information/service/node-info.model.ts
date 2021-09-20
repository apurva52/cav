import { ChartConfig } from 'src/app/shared/chart/service/chart.model';
import { TableHeaderColumn } from 'src/app/shared/table/table.model';

export interface NodeInfoData {
  nodeInfo: NodeInfoTable;
  charts: ChartConfig[];
}

export interface NodeInfoTableHeaderColumn extends TableHeaderColumn {
  statusField?: boolean;
  switchButton?: boolean;
}

export interface NodeInfoTableHeader {
  cols: NodeInfoTableHeaderColumn[];
}

export interface NodeInfoTable {
  headers?: NodeInfoTableHeader[];
  data?: any[];
  statsField?: string;
  switchField?: string;
}
