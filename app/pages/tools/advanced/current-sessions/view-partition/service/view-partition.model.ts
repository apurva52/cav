import { TableHeaderColumn, Table } from 'src/app/shared/table/table.model';

export interface ViewPartitionHeaderCols extends TableHeaderColumn {
}

export interface ViewPartitionTableHeader {
  cols: ViewPartitionHeaderCols[];
}

export interface ViewPartitionTable extends Table {
  headers?: ViewPartitionTableHeader[];
  iconsField?: any;
}



