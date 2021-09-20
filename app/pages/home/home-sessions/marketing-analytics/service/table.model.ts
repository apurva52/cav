import { ChartConfig } from 'src/app/shared/chart/service/chart.model';
import { Table, TableHeaderColumn } from 'src/app/shared/table/table.model';

export interface PageTableHeaderCols extends TableHeaderColumn {
    severityColorField?: boolean;
    severity?: boolean;
}

export interface PageTableHeader {
    cols: PageTableHeaderCols[];
}
export interface MarketAnalyticsTable extends Table {
    iconsField?: any;
    buttonField?: boolean;
    headers?: PageTableHeader[];
    severityCondition?: any;
    customTime: any;
    filtercriteria: any;
    campaigns: string[];
}


