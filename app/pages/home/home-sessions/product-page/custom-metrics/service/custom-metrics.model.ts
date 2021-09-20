import {
    TableHeaderColumn,
    Table,
} from 'src/app/shared/table/table.model';




export interface CustomMetricsDataTableHeaderColumn extends TableHeaderColumn {
    severityColorField?: boolean;
    iconField?: boolean;
}

export interface CustomMetricsDataTableHeader {
    cols: CustomMetricsDataTableHeaderColumn[];
}

export interface CustomDataTable extends Table {
    headers?: CustomMetricsDataTableHeader[];
    data: any[];
    severityBgColorField?: string;
}