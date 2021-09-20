import { TableHeaderColumn, Table } from 'src/app/shared/table/table.model';

export interface SchedulesCols extends TableHeaderColumn {
  severityColorField?: boolean;
}

export interface SchedulesTableHeader {
  cols: SchedulesCols[];
}

export interface SchedulesTable extends Table {
  headers?: SchedulesTableHeader[];
  severityBgColorField?: string;
  iconsField?: any;
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

