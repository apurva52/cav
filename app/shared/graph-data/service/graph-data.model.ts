import {
  TableHeaderColumn,
  Table,
} from 'src/app/shared/table/table.model';

export interface GraphDataTableHeaderCols extends TableHeaderColumn {
  
}

export interface TableHeader {
  cols: GraphDataTableHeaderCols[];
}

export interface GraphDataTable extends Table {
  headers?: TableHeader[];
}