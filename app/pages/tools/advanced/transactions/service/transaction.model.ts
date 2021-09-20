import { TableHeaderColumn, Table } from 'src/app/shared/table/table.model';

export interface TransactionHeaderCols extends TableHeaderColumn {
}

export interface TransactionTableHeader {
  cols: TransactionHeaderCols[];
}

export interface TrabsactionTable extends Table {
  headers?: TransactionTableHeader[];
}



