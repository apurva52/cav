
import { TableHeaderColumn, Table } from 'src/app/shared/table/table.model';

export interface HealthCheckMonitorHeaderCols extends TableHeaderColumn {
}

export interface HealthCheckMonitorTableHeader {
  cols: HealthCheckMonitorHeaderCols[];
}

export interface HealthCheckMonitorTable extends Table {
  headers?: HealthCheckMonitorTableHeader[];
}



