import { Table,  TableHeaderColumn } from 'src/app/shared/table/table.model';

export interface LogDetailsTableHeaderCols extends TableHeaderColumn {
  iconField?: boolean;
}
export interface LogTableHeader {
  cols: LogDetailsTableHeaderCols[];
}

export interface LogDetailsTable{
  layoutTable: Table; 
  detailInfoTable: Table;
}
