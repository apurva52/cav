import { Table } from "primeng";
import { TableHeaderColumn } from "src/app/shared/table/table.model";

export interface AddMonitor {
    components: any[];
    table:AwsConfigTable;
  }


  export interface AwsConfigHeaderCols extends TableHeaderColumn {
    actionIcon?: boolean;
  }

export interface AwsConfigTableHeader {
    cols: AwsConfigHeaderCols[];
  }
  
  export interface AwsConfigTable extends Table {
    headers?: AwsConfigTableHeader[];
    data?: any;
    paginator: any;
  }
