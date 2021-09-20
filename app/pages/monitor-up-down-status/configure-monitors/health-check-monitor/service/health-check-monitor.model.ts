import { Table } from "primeng";
import { TableHeaderColumn } from "src/app/shared/table/table.model";

  export interface ConfigDataHeaderCols extends TableHeaderColumn {
    actionIcon?: boolean;
  }

export interface ConfigDataTableHeader {
    cols: ConfigDataHeaderCols[];
  }
  
  export interface ConfigDataTable extends Table {
    headers?: ConfigDataTableHeader[];
    data?: any;
    paginator: any;
  }