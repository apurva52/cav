import { SelectItem } from "primeng";
import { Table, TableHeaderColumn } from "src/app/shared/table/table.model";

export interface CmonStatHeaderCols extends TableHeaderColumn {
    
  }

export interface CmonStatTableHeader {
    cols: CmonStatHeaderCols[];
  }
  
  export interface CmonStatTable extends Table {
    headers?: CmonStatTableHeader[];
 
   
  }