import { ChartConfig } from 'src/app/shared/chart/service/chart.model';
import { Table, TableHeaderColumn } from 'src/app/shared/table/table.model';

export interface PageTableHeaderCols extends TableHeaderColumn {
}

export interface PageTableHeader {
  cols: PageTableHeaderCols[];
}
export interface PageFilterTable extends Table {
  filtercriteria: any;
}
