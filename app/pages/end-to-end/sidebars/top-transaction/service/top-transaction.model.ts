import { TableHeader, TableSearch, TableSort, TablePagination, Table, TableHeaderColumn } from 'src/app/shared/table/table.model';



export interface TopTransactionTableHeaderCols extends TableHeaderColumn {
  }
  
export interface TopTransactionTableHeader {
    cols: TopTransactionTableHeaderCols[];
  }

export interface TopTransactionTable extends Table{
    headers?: TopTransactionTableHeader[];

}
