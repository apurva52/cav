import { ChartConfig } from 'src/app/shared/chart/service/chart.model';
import { Table, TableHeaderColumn } from 'src/app/shared/table/table.model';

export interface PerformanceTableHeaderCols extends TableHeaderColumn {
  severityColorField?: boolean;
  severity?: boolean;
  iconsField?: boolean;
}

export interface PerformanceTableHeader {
  cols: PerformanceTableHeaderCols[];
}
export interface PerformanceTable extends Table {
  headers?: PerformanceTableHeader[];
  headers1?: PerformanceTableHeader[];
  severityCondition?: any;
  charts: ChartConfig[];
  datarequest: any;
}
