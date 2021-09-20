import { ChartConfig } from 'src/app/shared/chart/service/chart.model';
import { Table } from 'src/app/shared/table/table.model';

export interface StateData {
  chartData?: ChartConfig;
  tableData?: Table;
}
