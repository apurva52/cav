import {
  TableHeaderColumn,
  Table,
} from 'src/app/shared/table/table.model';

export interface SessionsDataTableHeaderColumn extends TableHeaderColumn {
  severityColorField?: boolean;
  iconField?: boolean;
}

export interface SessionsDataTableHeader {
  cols: SessionsDataTableHeaderColumn[];
}

export interface SessionsDataTable extends Table {
  headers?: SessionsDataTableHeader[];
  severityBgColorField?: string;
}

