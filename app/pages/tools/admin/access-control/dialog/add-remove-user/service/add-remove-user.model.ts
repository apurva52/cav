import { SelectItem } from "primeng";
import { Table, TableHeader, TableHeaderColumn } from "src/app/shared/table/table.model";

export interface AddRemoveUserHeaderCols extends TableHeaderColumn {
    
  }

export interface AddRemoveUserTableHeader {
    cols: AddRemoveUserHeaderCols[];
  }
  
  export interface AddRemoveUserTable extends Table {
    headers?: AddRemoveUserTableHeader[];
  }