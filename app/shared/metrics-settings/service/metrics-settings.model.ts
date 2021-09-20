import { SelectItem } from 'primeng';
import { ChartConfig } from 'src/app/shared/chart/service/chart.model';
import {
    TableHeaderColumn,
    Table,
    //TableHeader,
  } from 'src/app/shared/table/table.model';
  
  
 

  export interface MetricsTable  {
    dataOperations ? : MetricsOperations[];
    metricTypes ? : SelectItem[];
    metricsValues : MetricsValues[];
    charts: ChartConfig[];
  }

  export interface MetricsOperations{
    check : string;
    label: string;
    selectValues: OperationSelectedValues[];
  }

  export interface OperationSelectedValues {
    label: string;
    value : string;
  }
  

  export interface MetricsValues {
    label: string;
  }

  export interface status {
    code: number,
    detailedMsg: string,
   msg: string
  }
  