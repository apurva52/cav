
import { Table, TableHeaderColumn } from "src/app/shared/table/table.model";

export interface CheckPointHeaderCols extends TableHeaderColumn {
    
  }

export interface CheckPointTableHeader {
    cols: CheckPointHeaderCols[];
  }
  
  export interface CheckPointTable extends Table {
    headers?: CheckPointTableHeader[];
  }