export interface Table {
  headers?: TableHeader[];
  data?: any[];
  sort?: TableSort;
  tableFilter?: boolean;
  resize?: boolean;
  search?: TableSearch;
  paginator?: TablePagination;
}

export interface TableWidget {
  headers?: TableHeader[];
  data?: any[];
  sort?: TableSort;
  tableFilter?: string;
  resize?: string;
  search?: TableSearch;
  paginator?: TablePagination;
}


export interface TableHeader {
  cols: TableHeaderColumn[];
}
export interface TableHeaderColumn {
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
  field?:string;
}

export interface TableSearch {
  fields?: string[];
  enable?: boolean;
}

export interface TablePagination {
  rows: number; // Number of rows to display per page.
  rowsPerPageOptions?: number[]; // Array of integer values to display inside rows per page dropdown of paginator
  totalRecords?: number; // Number of total records, defaults to length of value when not defined.
  first?: number; // Index of the first row to be displayed.
  lazy?: boolean; // Defines if data is loaded and interacted with in lazy manner from server.
}

export interface TableSort {
  fields?: string[];
  customSort?: string;
}

export interface TableColumnFilters {
  isFilter?: boolean;
  type?: string;
}

