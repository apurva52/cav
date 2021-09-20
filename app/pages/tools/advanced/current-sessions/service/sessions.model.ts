import { TableHeaderColumn, Table } from 'src/app/shared/table/table.model';

export interface SessionHeaderCols extends TableHeaderColumn {
}

export interface SessionTableHeader {
  cols: SessionHeaderCols[];
}

export interface SessionTable extends Table {
  headers?: SessionTableHeader[];
}



