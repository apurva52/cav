import { Table } from "src/app/shared/table/table.model";

export interface methodTraceTable extends Table {
  methodCollectionTree?: Table;
  methodTimingTable?: Table;
}
