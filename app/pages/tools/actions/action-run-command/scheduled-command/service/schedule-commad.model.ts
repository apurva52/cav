import { TableHeaderColumn, Table } from 'src/app/shared/table/table.model';

export interface ScheduleCommandHeaderCols extends TableHeaderColumn {
}

export interface ScheduleCommandHeaderTable {
  cols: ScheduleCommandHeaderCols[];
}

export interface ScheduleCommandTable extends Table {
  headers?: ScheduleCommandHeaderTable[];
}



