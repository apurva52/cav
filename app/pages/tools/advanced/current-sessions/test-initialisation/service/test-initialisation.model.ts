import { ChartConfig } from 'src/app/shared/chart/service/chart.model';
import { Table, TableHeaderColumn } from 'src/app/shared/table/table.model';

export interface TestInitChart {
  charts: ChartConfig[];
  title?: string;
  highchart?: Highcharts.Options;
}

export interface TestInitData extends Table { 
  iconsField?: any;
}
