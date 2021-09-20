
import { Table, TableHeaderColumn } from "src/app/shared/table/table.model";

export interface AlertBaselineHeaderCols extends TableHeaderColumn {
    
  }

export interface AlertBaselineTableHeader {
    cols: AlertBaselineHeaderCols[];
  }
  
  export interface AlertBaselineTable extends Table {
    headers?: AlertBaselineTableHeader[];
    iconsField?: any;
  }