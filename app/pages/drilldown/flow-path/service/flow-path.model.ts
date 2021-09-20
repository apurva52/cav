import { TableHeaderColumn, Table } from 'src/app/shared/table/table.model';

export interface FlowPathTableHeaderCols extends TableHeaderColumn {
  severityColorField?: boolean;
}

export interface FlowPathTableHeader {
  cols: FlowPathTableHeaderCols[];
}

export interface FlowPathTable extends Table {
  headers?: FlowPathTableHeader[];
  severityBgColorField?: string;
  count?:number;
}
