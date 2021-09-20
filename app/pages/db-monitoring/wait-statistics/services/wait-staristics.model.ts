import { Table } from "src/app/shared/table/table.model";

export interface WaitStatisticsTable extends Table {
    waitStatistics?: Table;
    sessionStatistics?: Table;    
    iconsField?: any;
  }