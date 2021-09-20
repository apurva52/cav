import { Table } from "src/app/shared/table/table.model";

export interface customDataTable extends Table {
  method?: Table;
  sessionAttribute?: Table;
  httpRequest?: Table;
  httpResponse?: Table;
}
