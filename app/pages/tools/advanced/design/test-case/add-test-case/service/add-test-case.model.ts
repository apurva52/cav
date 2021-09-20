import { Table } from "src/app/shared/table/table.model";


export interface AddTestCaseTable extends Table {
  checkProfileTable?: Table;
  iteration?: Table;
  testScriptTable?: Table;
  iconsField?: any;
}