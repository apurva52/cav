import { TableHeaderColumn, Table } from 'src/app/shared/table/table.model';

export interface ScenariosHeaderCols extends TableHeaderColumn {
}

export interface ScenariosTableHeader {
  cols: ScenariosHeaderCols[];
}

export interface ScenariosTable extends Table {
  headers?: ScenariosTableHeader[];
}



