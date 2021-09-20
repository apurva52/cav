import { TableHeaderColumn, Table } from 'src/app/shared/table/table.model';

export interface taticticTableHeaderCols extends TableHeaderColumn {
  severityColorField?: boolean;
}

export interface StaticticTableHeader {
  cols: taticticTableHeaderCols[];
}

export interface StaticticTable extends Table {
  headers?: StaticticTableHeader[];
  
}