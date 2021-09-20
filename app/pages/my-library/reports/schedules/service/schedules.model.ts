import { metricIds } from 'src/app/shared/metrics/relatedmetrics/service/relatedmetrics.model';
import { TableHeaderColumn, Table } from 'src/app/shared/table/table.model';

export interface SchedulesHeaderCols extends TableHeaderColumn {
}


export interface SchedulesTableHeader {
  cols: SchedulesHeaderCols[];
}

export interface SchedulesTable extends Table {
  headers?: SchedulesTableHeader[];
  data?: ScheduleTableAvailable[];
}

export interface DeleteTask {
  delete: DeleteTask [];
}
export interface DownloadTask {
  delete: DownloadTask [];
}
export interface EditTask {
  delete: EditTask [];
}

export interface EnableDisableTask {
  delete: EnableDisableTask [];
}


export interface ScheduleTableAvailable{
      cronStr?:string,
      expiryTime?: string,
      schTime?: string,
      scheduled?:boolean,
      taskDes?: string,
      status?: string,
      taskId?:number,
      taskType?: string,
}
