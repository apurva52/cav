
import { Table, TableHeaderColumn } from 'src/app/shared/table/table.model';

export interface IndicesMetricsData {
  indicesMetricsStats?: IndicesMetricsStatistics[];
  indicesMetricsHealth?: IndicesMetricsTable;
  indicesMetricsDocuments?: Table;
}

export interface IndicesMetricsStatistics {
  label?: string;
  value?: string;
}

export interface IndicesMetricsTableHeaderColumn extends TableHeaderColumn {
  statusField?: boolean;
}

export interface IndicesMetricsTableHeader {
  cols: IndicesMetricsTableHeaderColumn[];
}

export interface IndicesMetricsTable {
  headers?: IndicesMetricsTableHeader[];
  data?: any[];
  statsField?: string;
}
