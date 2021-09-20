import { TableHeader, TableSearch, TableSort, TablePagination, TableHeaderColumn, Table } from 'src/app/shared/table/table.model';


export interface SearchSidebarTableHeaderCols extends TableHeaderColumn {
  }
  
  export interface SearchSidebarTableHeader {
    cols: SearchSidebarTableHeaderCols[];
  }
export interface SearchSidebarData {
    tableData: SearchSidebarTable;
    values: SearchSidebarValues;
}

export interface SearchSidebarTable extends Table{
    headers?: SearchSidebarTableHeader[];
   
}

export interface SearchSidebarValues {
    tier?: SearchSidebarTier[];
    mode?: SearchSidebarMode[];
    name?: SearchSidebarName[];
    operation?: SearchSidebarOperation[];
}
export interface SearchSidebarLoadPayload {

}


export interface SearchSidebarTier {

    label: string;
    value: string;
}

export interface SearchSidebarMode {

    label: string;
    value: string;
}

export interface SearchSidebarName {

    label: string;
    value: string;
}
export interface SearchSidebarOperation {

    label: string;
    value: string;
}


