import { ChartConfig } from 'src/app/shared/chart/service/chart.model';
import { Table } from 'src/app/shared/table/table.model';

export interface MethodTimingData {
  panels: MethodSummaryPanel[];
}

export interface MethodSummaryPanel extends Table {
  label: string;
  collapsed?: boolean;
  menuOption?: boolean;
  readField?: string;
  rowBgColorField?: string;
  severityBgColorField?: string;
  urlsField?: string;
  iconsField?: any;
  charts?: ChartConfig[];
  tableFilter?: boolean;
  restData?:any;
}
 
export interface ServiceMethodTimingParams {
  tierName?:string;
  serverName?:string;
  instanceName?:string;
  appId?:string;
  serverId?:string;
  tierId?:string;
  fpInstance?:string;
  urlIndex?:string;
  methodID?:number;
  startTime?:number;
  endTime?:number;

}


