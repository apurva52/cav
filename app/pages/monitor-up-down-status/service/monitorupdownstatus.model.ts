import { SelectItem } from 'primeng';
import { ClientCTX } from 'src/app/core/session/session.model';
import {
  Table,
  TableHeader,
  TableHeaderColumn,
} from 'src/app/shared/table/table.model';

export interface MonitorupdownstatusHeaderCols extends TableHeaderColumn {}

export interface MonitorupdownstatusTableHeader {
  cols: MonitorupdownstatusHeaderCols[];
}
export interface MonitorupdownstatusTable extends Table {
  headers?: MonitorupdownstatusTableHeader[];
  options: SelectItem[];
  iconsField?: any;
  tableFilter?: boolean;
  status?: Status;
}

export interface Status {
  code?: number;
  msg?: string;
}

export interface MonitorupdownstatusPayload {
  cctx?: ClientCTX;
  tr?: number;
  sp?: string;
}
