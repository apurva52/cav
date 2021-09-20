import { ClientCTX } from 'src/app/core/session/session.model';
import {
  TableHeaderColumn,
  Table,
} from 'src/app/shared/table/table.model';

export interface CookiesTableHeaderColumn extends TableHeaderColumn {
  iconField?: boolean;
  severityColorField?: boolean;
}

export interface CookiesTableHeader {
  cols: CookiesTableHeaderColumn[];
}

export interface CookiesTable extends Table {
  headers?: CookiesTableHeader[];
  data:any;
  severityBgColorField?: string;
}