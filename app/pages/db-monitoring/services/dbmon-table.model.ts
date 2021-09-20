import { Table,  TableColumnFilters,  TableHeader,  TableHeaderColumn, TablePagination, TableSearch, TableSort } from 'src/app/shared/table/table.model';

export class DBMonTableHeaderCols implements TableHeaderColumn {
    width?: string;
    label: string;
    colspan?: number;
    rowspan?: number;
    valueField?: string;
    tooltip?: string;
    value?: string;
    icon?: string;
    classes?: string;
    dataClasses?: string;
    filter?: TableColumnFilters;
    format?: string;
    tooltipField?: string;
    selected?: boolean;
    isSort?: boolean;
    urlField?: boolean;
    iconField?: boolean;
    severityColorField?: boolean;
    position?: number;
    title?: string;
}
export class DBMonTableHeader {
  cols: DBMonTableHeaderCols[];
}

export class DBMonTable implements Table {
  data?: any[];
  sort?: TableSort;
  tableFilter?: boolean;
  resize?: boolean;
  search?: TableSearch;
  paginator?: TablePagination;
  headers?: DBMonTableHeader[]; 
  responseBtns?: any[];

}
