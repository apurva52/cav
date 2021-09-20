import { ClientCTX } from 'src/app/core/session/session.model';
import {
  TableSearch,
  TableSort,
  TablePagination,
  TableHeaderColumn,
  TableHeader,
  Table,
} from 'src/app/shared/table/table.model';

export interface SessionsTableHeaderColumn extends TableHeaderColumn {
  iconField?: boolean;
  severityColorField?: boolean;
}

export interface SessionsTableHeader {
  cols: SessionsTableHeaderColumn[];
}

export interface SessionsTable extends Table {
  headers?: SessionsTableHeader[];
  severityBgColorField?: string;
}

export interface AutoCompleteData {
  autocompleteData?: any;
}

