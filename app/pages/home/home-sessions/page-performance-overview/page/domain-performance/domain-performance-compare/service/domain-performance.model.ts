import { ChartConfig } from 'src/app/shared/chart/service/chart.model';
import { Table, TableHeaderColumn } from 'src/app/shared/table/table.model';


export interface DomainPerformanceCompareTable extends Table {
  charts: ChartConfig[];
  data: [];
  calDomainData: [];
}
