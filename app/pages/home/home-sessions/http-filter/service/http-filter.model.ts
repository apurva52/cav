import { ClientCTX } from 'src/app/core/session/session.model';
import {
  TableHeaderColumn,
  Table,
} from 'src/app/shared/table/table.model';

export interface HttpAggFilterTableHeaderColumn extends TableHeaderColumn {
  iconField?: boolean;
  severityColorField?: boolean;
}

export interface HttpAggFilterTableHeader {
  cols: HttpAggFilterTableHeaderColumn[];
}

export interface HttpAggFilterTable extends Table {
  headers?: HttpAggFilterTableHeader[];
  data:any;
  severityBgColorField?: string;
}

export interface AutoCompleteData {
  autocompleteData?: any;
}

