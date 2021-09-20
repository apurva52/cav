import { ChartConfig } from 'src/app/shared/chart/service/chart.model';
import { Table, TableHeaderColumn } from 'src/app/shared/table/table.model';

export interface ClusterMonitor {
  charts: ChartConfig[];
  clusterStats: any;
  clusterHealth: ClusterTable;
  clusterIndices: Table;
}

export interface ClusterStatistics {
  label?: string;
  value?: any;
}

export interface ClusterTableHeaderColumn extends TableHeaderColumn {
  statusField?: boolean;
}

export interface ClusterTableHeader {
  cols: ClusterTableHeaderColumn[];
}

export interface ClusterTable {
  headers?: ClusterTableHeader[];
  data: any;
  statsField?: string;
}
export interface VisualChart {
  charts: ChartConfig[];    
}
