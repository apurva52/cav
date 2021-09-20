// import {

//   TableHeaderColumn,
//   Table,
// } from 'src/app/shared/table/table.model';
import { ChartConfig } from 'src/app/shared/chart/service/chart.model';
import {
  TablePagination,
  TableSearch,
  TableSort,
  TableHeaderColumn,
  Table,
} from 'src/app/shared/table/table.model';

export interface DBReportData {
  panels: DbQueriesPanel[];
}

export interface DbQueriesTableHeaderCols extends TableHeaderColumn {}

export interface DbQueriesTableHeader {
  cols: DbQueriesTableHeaderCols[];
}

export interface DbQueriesPanel extends Table {
  label: string;
  headers?: DbQueriesTableHeader[];
  collapsed?: boolean;
  charts?: ChartConfig[];
  restData?:any;
}
