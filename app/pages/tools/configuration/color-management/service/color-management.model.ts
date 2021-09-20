import { TableHeaderColumn, Table } from 'src/app/shared/table/table.model';

export interface ColorMangementHeaderCols extends TableHeaderColumn {
}

export interface ColorMangementTableHeader {
  cols: ColorMangementHeaderCols[];
}

export interface ColorMangementTable extends Table {
  headers?: ColorMangementTableHeader[];
}



