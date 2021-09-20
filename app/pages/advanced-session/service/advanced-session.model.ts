import { TableHeaderColumn, Table } from 'src/app/shared/table/table.model';

export interface AdvancedSessionHeaderCols extends TableHeaderColumn {
  severityColorField?: boolean;
}

export interface AdvancedSessionTableHeader {
  cols: AdvancedSessionHeaderCols[];
}

export interface AdvancedSessionTable extends Table {
  headers?: AdvancedSessionTableHeader[];
  severityBgColorField?: string;
  iconsField?: any;
}