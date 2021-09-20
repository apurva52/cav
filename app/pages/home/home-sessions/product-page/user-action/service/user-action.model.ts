import { ClientCTX } from 'src/app/core/session/session.model';
import {
  TableHeaderColumn,
  Table,
} from 'src/app/shared/table/table.model';

export interface UserActionTableHeaderColumn extends TableHeaderColumn {
  iconField?: boolean;
  severityColorField?: boolean;
}

export interface UserActionTableHeader {
  cols: UserActionTableHeaderColumn[];
}

export interface UserActionTable extends Table {
  headers?: UserActionTableHeader[];
  data:any;
  severityBgColorField?: string;
}