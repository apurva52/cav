import { Table, TableHeaderColumn } from "src/app/shared/table/table.model";

export interface profileHeaderCols extends TableHeaderColumn {
  actionIcon?: boolean;
}

export interface profileTableHeader {
  cols: profileHeaderCols[];
}

export interface profileTable extends Table {
  headers?: profileTableHeader[];
}

// export interface profileTable extends Table {
//  iconField?: boolean;
// }
