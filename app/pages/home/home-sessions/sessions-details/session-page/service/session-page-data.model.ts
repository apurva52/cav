import {
  TableHeaderColumn,
  Table,
} from 'src/app/shared/table/table.model';

export interface SessionsPageDataTableHeaderColumn extends TableHeaderColumn {
  severityColorField?: boolean;
  iconField?: boolean;
}

export interface SessionsPageDataTableHeader {
  cols: SessionsPageDataTableHeaderColumn[];
}

export interface SessionsDataTable extends Table {
  headers?: SessionsPageDataTableHeader[];
  severityBgColorField?: string;
}

