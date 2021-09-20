import { ChartConfig } from "src/app/shared/chart/service/chart.model";
import { Table } from "src/app/shared/table/table.model";

export interface tempDbTable extends Table {
  charts?:  ChartConfig[];
  }