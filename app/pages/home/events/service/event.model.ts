import { ClientCTX } from 'src/app/core/session/session.model';
import {
  TableSearch,
  TableSort,
  TablePagination,
  TableHeaderColumn,
  TableHeader,
} from 'src/app/shared/table/table.model';

export interface EventsTableHeaderColumn extends TableHeaderColumn {
  blinkerField?: boolean;
  drillField?: boolean;
  severityColorField?: boolean;
}

export interface EventsTableHeader {
  cols: EventsTableHeaderColumn[];
}

export interface EventsTable {
  headers?: EventsTableHeader[];
  data?: any[];
  search?: TableSearch;
  sort?: TableSort;
  paginator?: TablePagination;
  filters?: EventFilter[];
  readField?: string; // Boolean field
  bilnkField?: string;
  rowBgColorField?: string;
  severityBgColorField?: string;
  status?: Status;
  tableFilter?: boolean; 
}

export interface Status {
  code?: number;
  msg?: string;
}

export interface EventFilter {
  name?: string;
  key?: string;
  color?: string;
  selected?: boolean;
  showInLegend?: boolean;
}

export interface EventsTableLoadPayload {
  cctx? : ClientCTX
  tr? : string;
  type?: string;
  severity?: string;
  sp?: string
}

export interface FilterObject {
  type?: string;
  severity?: string;
  sp?: string;
}
