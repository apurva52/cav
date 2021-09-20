import {
  TableHeaderColumn, TablePagination, TableSearch, TableSort,
} from 'src/app/shared/table/table.model';


export interface DynamicLoggingTableHeaderCols extends TableHeaderColumn {
  severityColorField?: boolean;
}

export interface TableHeader {
  cols: DynamicLoggingTableHeaderCols[];
}

export interface DynamicLoggingTable {
  headers?: TableHeader[];
  data?: any[];
  search?: TableSearch;
  sort?: TableSort;
  paginator?: TablePagination;
}


