import { TableHeaderColumn, Table } from 'src/app/shared/table/table.model';

export interface IndexPatternHeaderCols extends TableHeaderColumn {

}

export interface IndexPatternTableHeader {
  cols: IndexPatternHeaderCols[];
}

export interface IndexPatternTable extends Table {
  headers?: IndexPatternTableHeader[];
  severityBgColorField?: string;
  iconsField?: any;
}


export interface User {
  label?: string;
  time?: string;
  icon?: string;
}

