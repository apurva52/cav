import { SelectItem } from "primeng";
import { Table, TableHeaderColumn } from "src/app/shared/table/table.model";

export interface addBaselineHeaderCols extends TableHeaderColumn {
    
  }

export interface addBaselineTableHeader {
    cols: addBaselineHeaderCols[];
  }
  
  export interface addBaselineable extends Table {
    headers?: addBaselineTableHeader[];
    iconField?: any;
   
  }