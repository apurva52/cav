import { Table } from "src/app/shared/table/table.model";
import { ChartConfig } from 'src/app/shared/chart/service/chart.model';

export interface VisualChart {
  charts: ChartConfig[];
  title?: string;
  highchart?: Highcharts.Options;
}


export interface postgressStatsTable extends Table {
  statsBasedOnDatabase?: Table;
  statsBasedOnApplication?: Table;
}
