import { TableHeader, TablePagination, TableSearch, TableSort, TableHeaderColumn, Table } from 'src/app/shared/table/table.model';

import { TableBoxTable } from 'src/app/pages/dashboard-service-req/ip-summary/table-box/service/table-box.model';

export interface IpSummaryData {
    panels: IpSummaryPanel[];
}
export interface IndIpData {
    panels: IndIpPanel[];
    indBtPopupData : TableBoxTable[];
}

export interface IpSummaryTableHeaderCols extends TableHeaderColumn {
    severityColorField?: boolean;
}
export interface IndIpTableHeaderCols extends TableHeaderColumn {
    severityColorField?: boolean;
}

export interface IpSummaryTableHeader {
    cols: IpSummaryTableHeaderCols[];
}
export interface IndIpTableHeader {
    cols: IpSummaryTableHeaderCols[];
}

export interface IpSummaryPanel extends Table {
    label: string;
    collapsed?: boolean;
    menuOption?: boolean;
}

export interface IndIpPanel extends Table {
    label: string;
    collapsed?: boolean;
    menuOption?: boolean;
}
