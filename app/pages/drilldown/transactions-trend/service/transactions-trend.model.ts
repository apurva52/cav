import { MenuItem } from 'primeng';
import { ChartConfig } from 'src/app/shared/chart/service/chart.model';
import {
  TableSearch,
  TableSort,
  TablePagination,
  TableHeader,
  Table,
  TableHeaderColumn,
} from '../../../../../app/shared/table/table.model';

export interface TransactionTrendTableHeaderCols extends TableHeaderColumn {
  severityColorField?: boolean;
}

export interface TransactionTrendData {
  tableData?: TransactionTrendTable;
  specifiedTime?: TransactionTrendSpecifiedTime;
  charts?: ChartConfig[];
}

export interface TransactionTrendTableHeader {
  cols: TransactionTrendTableHeaderCols[];
}
export interface TransactionTrendSpecifiedTime {
  selected?: MenuItem;
  previous?: MenuItem;
  options?: MenuItem[];
}
export interface TransactionTrendTable extends Table {
  headers?: TransactionTrendTableHeader[];
  severityBgColorField?: string;
}

export interface AutoplayConfig {
  enabled: boolean;
  ratio: string;
}
