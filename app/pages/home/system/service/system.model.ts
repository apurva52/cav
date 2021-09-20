import { ChartConfig } from 'src/app/shared/chart/service/chart.model';

export interface SystemTable { 
  charts: SystemRouting[];
  monitorsData: any;
  dynamicData: dataObj[];
}
 export interface SystemRouting extends ChartConfig{
  pagelink?: string;
}

export interface dataObj{
  type:String,
  data: any
 }