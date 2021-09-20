import { TableHeaderColumn, Table } from 'src/app/shared/table/table.model';

export interface NdeClusterConfigHeaderCols extends TableHeaderColumn {
}

export interface NdeClusterConfigTableHeader {
  cols: NdeClusterConfigHeaderCols[];
}

export interface NdeClusterConfigTable extends Table {
  headers?: NdeClusterConfigTableHeader[];
}



