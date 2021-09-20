import { MenuItem } from 'primeng';
import { ClientCTX } from 'src/app/core/session/session.model';
import { TableHeaderColumn, Table } from 'src/app/shared/table/table.model';

export interface AuditLogHeaderCols extends TableHeaderColumn {
  severityColorField?: boolean;
}

export interface AuditLogTableHeader {
  cols: AuditLogHeaderCols[];
}

export interface ActiveUsers {
  label?: string;
  time?: string;
  icon?: string;
}

export interface SessionList {
  label?: string;
  time?: string;
}

export interface ExtraLogInfo {
  activeUserList?: string[];
  activeUsers?: number;
  activityList?: string[];
  moduleList?: string[];
  numberOfActiveSessions?: number;
  users?: ActiveUsers[];
  session?: SessionList[];
  selectedLabel?: string;
  startDate?: string;
  endDate?: string;
}

export interface GroupBy {
  label?: string;
  selected?: boolean;
}

export interface AuditLogTable extends Table {
  headers?: AuditLogTableHeader[];
  severityBgColorField?: string;
  iconsField?: any;
  extraLogsInfo?: ExtraLogInfo;
  groupBy?: GroupBy[];
  status?: Status;
}

export interface Status {
  code?: number;
  msg?: string;
}

export interface Session {
  label?: string;
  time?: string;
}

export interface User {
  label?: string;
  time?: string;
  icon?: string;
}

export interface AuditLogsTableLoadPayload {
  cctx?: ClientCTX;
  groupBy?: string;
  sp?: string;
  include?: boolean;
  activity?: string[];
  modules?: string[];
  st?: number;
  et?: number; 

//  duration?: AuditLogsTableLoadDuration;

}
// export interface AuditLogsTableLoadDuration{
//   st?: number;
//   et?: number; 

// }
