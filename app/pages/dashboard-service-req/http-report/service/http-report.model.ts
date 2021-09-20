import { TablePagination, TableSearch, TableSort, TableHeaderColumn, Table } from 'src/app/shared/table/table.model';


export interface HttpReportData {
    panels: HttpReportsPanel[];
    
}

export interface HttpReportTableHeaderCols extends TableHeaderColumn {

}

export interface HttpReportTableHeader {
    cols: HttpReportTableHeaderCols[];
}

export interface HttpReportsPanel extends Table {
    label: string;
    headers: HttpReportTableHeader[];
    search?: TableSearch;
    sort?: TableSort;
    paginator?: TablePagination;
    collapsed?: boolean;
    tableFilter?: boolean;
}
