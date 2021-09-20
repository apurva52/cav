import { ChartConfig } from 'src/app/shared/chart/service/chart.model';
import { TimeFilterValue } from 'src/app/shared/time-filter/time-filter/time-filter.component';

export interface VisualChart {
  charts: ChartConfig[];
  title?: string;
  highchart?: Highcharts.Options;
}

export interface MarketingAnalyticsOverviewFilter {
  timefilter: TimeFilterValue
}


export interface MADetailFilter {
  timefilter: TimeFilterValue;
  bucket: string;
  campaign: string;
}
