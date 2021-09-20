import { MenuItem, SelectItem, Table } from 'primeng';
import { AppError } from 'src/app/core/error/error.model';
import { ChartConfig } from 'src/app/shared/chart/service/chart.model';
import { TableHeader } from 'src/app/shared/table/table.model';
import { TimeFilterValue } from 'src/app/shared/time-filter/time-filter/time-filter.component';

export interface RevenueAnalyticsTable {
    charts: ChartConfig[];
    severityCondition?: any;
}

export interface RevenueAnalyticsFilter {
    timeFilter: TimeFilterValue;
    channels: string; // comma sepearted channel id
    granularity: string;
    metricType: string;
    pages: string; // comma seperated page id list.
    rollingwindow: string;
}

export interface WidgetData {
    title ?:string;
    loading: boolean;
    error: AppError;
    empty: boolean;
    data: any;
}

export interface OpportunityData {
    lastMonthSale: string;
    monthlyOpportunity: string;
    anualOpportunity: string;
}

export interface RASummaryData {
    totalRevenue: string;
    avgMetricValue: string;
    avgOptimalMetricValue: string;
    avgSlowerOptimalPct: string;
    totalRAloss: string;
    totalRevenueGain1s: string;
    totalRevenueGain2s: string;
    totalRevenueGain3s: string;
}

export class Revenuetable {

    constructor(dbrecord: any, totalpageviews) {
        this["pageid"] = dbrecord.pageid;
        this["pagename"] = dbrecord.pageName;
        this["metric"] = dbrecord.metric;
        this["optimalMetricValue"] = dbrecord.optimalMetricValue;
        this["slowerOptimalPct"] = dbrecord.slowerOptimalPct;
        this["raLoss"] = (parseFloat(dbrecord.raLoss));
        this["onesecgain"] = (parseFloat(dbrecord.gain["revenueGain1s"]));
        this["twosecgain"] = (parseFloat(dbrecord.gain["revenueGain2s"]));
        this["threesecgain"] = (parseFloat(dbrecord.gain["revenueGain3s"]));
        this["pageView"] = dbrecord.pageView;
        this["pagecontribution"] = ((dbrecord.pageView / totalpageviews) * 100).toFixed(2);
        this["formattedraLoss"] = this.nFormatter(parseFloat(dbrecord.raLoss));
        this["formattedonesecgain"] = this.nFormatter(parseFloat(dbrecord.gain["revenueGain1s"]));
        this["formattedtwosecgain"] = this.nFormatter(parseFloat(dbrecord.gain["revenueGain2s"]));
        this["formattedthreesecgain"] = this.nFormatter(parseFloat(dbrecord.gain["revenueGain3s"]));

    }

    nFormatter(num) {
        if (num >= 1000000000) {
            return "$" + ((num / 1000000000).toFixed(1).replace(/\.0$/, '') + 'B');
        }
        if (num >= 1000000) {
            return "$" + ((num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M');
        }
        if (num >= 1000) {
            return "$" + ((num / 1000).toFixed(1).replace(/\.0$/, '') + 'K');
        }
        return "$" + num;
    }
}