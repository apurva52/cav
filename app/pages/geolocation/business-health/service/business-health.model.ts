import {
    TableSearch,
    TableSort,
    TablePagination,
    TableHeaderColumn, Table
  } from 'src/app/shared/table/table.model';
  
  export interface BusinessHealthTableHeaderCols extends TableHeaderColumn {
    drillField?: boolean;
    severityColorField?: boolean;
  }
  
  export interface BusinessHealthTableHeader {
    cols: BusinessHealthTableHeaderCols[];
  }
  
  export interface BusinessHealthTable extends Table{
    headers?: BusinessHealthTableHeader[];
    filters?: BusinessHealthFilter[];
    readField?: string; // Boolean field
  }
  
  export interface BusinessHealthFilter {
    name?: string;
    key?: string;
    color?: string;
    selected?: boolean;
    showInLegend?: boolean;
  }
  
  export interface BusinessHealthTableLoadPayload {
    filters?: BusinessHealthFilter[];
  }