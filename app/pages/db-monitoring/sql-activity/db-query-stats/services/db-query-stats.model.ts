import { ChartConfig } from "src/app/shared/chart/service/chart.model";
import { Table } from "src/app/shared/table/table.model";
import { DBMonCommonParam } from "../../../services/request-payload.model";

// export interface DBQueryStatsTable extends Table {
//   charts?:  ChartConfig[];
//   }

  export interface DBQueryStatsParam extends DBMonCommonParam{
    queryCount: number;
    queryBasis: string;
    query: string;
  }