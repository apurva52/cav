import { Table } from "primeng";
import { ChartConfig } from "src/app/shared/chart/service/chart.model";
import { TableHeaderColumn } from "src/app/shared/table/table.model";

export interface AWSMonitoring {
    charts: ChartConfig[];
    table: AwsTable;

    
  }

  export interface AwsTableHeaderColumn extends TableHeaderColumn {
    statusField?: boolean;
    actionIcon?: boolean;
  }
  
  export interface AwsTableHeader {
    cols: AwsTableHeaderColumn[];
  }
  
  export interface AwsTable {
    headers?: AwsTableHeader[];
    data?: any[];
    statsField?: string;
  }

