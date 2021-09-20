import { SelectItem } from 'primeng';
import { ChartConfig } from 'src/app/shared/chart/service/chart.model';
import { TimeFilterValue } from 'src/app/shared/time-filter/time-filter/time-filter.component';


export interface PathAnalytics {
  pathChart?: ChartConfig;
  pageOptions?: SelectItem[];
}

export interface PathAnalyticsFilter {
    timeFilter: TimeFilterValue;
    channels: string; // comma sepearted channel id
    granularity: string;
    metricType: string;
    pages: string; // comma seperated page id list.
    rollingwindow: string;
}

