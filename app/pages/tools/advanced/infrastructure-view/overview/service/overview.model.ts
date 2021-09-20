import { ChartConfig } from 'src/app/shared/chart/service/chart.model';
import { Table } from 'src/app/shared/table/table.model';

export interface overviewTable extends Table {
    charts: ChartConfig[];
    graphs: ChartConfig[];
    environments?: any;
    components?: any;
   
}