import { Table,  TableHeaderColumn } from 'src/app/shared/table/table.model';

export interface LogTableHeaderCols extends TableHeaderColumn {
  badgeField?: boolean;
}
export interface TableHeader {
  cols: LogTableHeaderCols[];
}

export interface LogTable extends Table {
  headers?: TableHeader[]; 
  responseBtns?: any[];
}
