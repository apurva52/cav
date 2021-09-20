import { Table, TableHeaderColumn } from 'src/app/shared/table/table.model';

export interface NodeDiagnostics {
  nodeDiagnosticsStats: NodeSummary[];
  nodeSummary: NodeTable;
  nodeFileSystem: NodeTable;
  nodeIndexActivity: NodeTable;
  nodeMemory: NodeTable;
}

export interface NodeSummary {
  label?: string;
  value?: string;
  severityColor?: string;
}

export interface NodeTableHeaderColumn extends TableHeaderColumn {
  statusField?: boolean;
}

export interface NodeTableHeader {
  cols: NodeTableHeaderColumn[];
}

export interface NodeTable {
  headers?: NodeTableHeader[];
  data?: any[];
  statsField?: string;
}
