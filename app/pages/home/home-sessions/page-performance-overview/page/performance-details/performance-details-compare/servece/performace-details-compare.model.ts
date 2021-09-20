import { ChartConfig } from 'src/app/shared/chart/service/chart.model';
import { Table, TableHeaderColumn } from 'src/app/shared/table/table.model';


export interface PerformanceCompareTable extends Table {
    charts: ChartConfig[];
    dataLoaded: any;
}
