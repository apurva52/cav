import { ChartConfig } from "src/app/shared/chart/service/chart.model";
import { Table } from "src/app/shared/table/table.model";
import { TimeFilter } from './../../../common/interfaces/timefilter';

export interface ResourceTimingTable extends Table{
    hostStatisticsTable?: Table;
    contentStatisticsTable?: Table;
    bottleneckTable?: Table;
    iconsField?: any; 
    DomainActivtyTable?:Table; 
    Waterfall_table?:Table;
}

export interface VisualChart {
    hostStatisticsCharts?: ChartConfig[];    
    contentStatisticsCharts?: ChartConfig[];
    domainActivityCharts?: ChartConfig[];
    bottleneckCharts?: ChartConfig[];
}

export interface resourceTimingData {
    host: string;
    url: string;
    domains: string | number;
    resource?: string;
    bottleneckTable?: Table | number;
    bottleneckCharts?: ChartConfig[] | number;
}

export interface TrendFilterCriteria {
    timeFilter: TimeFilter;
    pages: number;
    bucket: number;
    domains: string;
    resource?: string;
}