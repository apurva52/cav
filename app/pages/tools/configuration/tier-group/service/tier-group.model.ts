import { TableHeaderColumn, Table } from 'src/app/shared/table/table.model';

export interface TierGroupHeaderCols extends TableHeaderColumn {
}

export interface TierGroupTableHeader {
  cols: TierGroupHeaderCols[];
}

export interface TierGroupTable extends Table {
  headers?: TierGroupTableHeader[];
}



