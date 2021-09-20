import { ClientCTX } from 'src/app/core/session/session.model';
import {
  TableHeaderColumn,
  TableHeader,
  TableSearch,
  TableSort,
  Table,
} from 'src/app/shared/table/table.model';

export interface JsErrorAggFilterTableHeaderColumn extends TableHeaderColumn {
  iconField?: boolean;
  severityColorField?: boolean;
}

export interface JsErrorAggFilterTableHeader {
  cols: JsErrorAggFilterTableHeaderColumn[];
}

export interface JsErrorAggFilterTable extends Table {
  headers?: JsErrorAggFilterTableHeader[];
  data:any;
  severityBgColorField?: string;
}
export interface AutoCompleteData {
  autocompleteData?: any;
}
