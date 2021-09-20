import { TableHeaderColumn, Table } from 'src/app/shared/table/table.model';

export interface VisualTableHeaderCols extends TableHeaderColumn {
  severityColorField?: boolean;
}

export interface VisualTableHeader {
  cols: VisualTableHeaderCols[];
}

export interface VisualTable extends Table {
  headers?: VisualTableHeader[];
  severityBgColorField?: string;
  iconsField?: any;
}