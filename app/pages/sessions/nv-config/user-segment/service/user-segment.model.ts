import { Table, TableHeaderColumn } from 'src/app/shared/table/table.model';

export interface UserSegsmentDataHeaderCols extends TableHeaderColumn {
  buttonField?: boolean;
}

export interface UserSegmentTableHeader {
  cols: UserSegsmentDataHeaderCols[];
}
export interface UserSegmentTable extends Table {
  headers?: UserSegmentTableHeader[];
  data: any;
  iconsField?: any;
}
