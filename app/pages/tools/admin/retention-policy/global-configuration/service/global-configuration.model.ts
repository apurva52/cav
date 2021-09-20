import { SelectItem } from "primeng";
import { Table, TableHeader, TableHeaderColumn } from "src/app/shared/table/table.model";

export interface CleanupHeaderCols extends TableHeaderColumn {
    actionIcon?: boolean;
  }

export interface CleanupTableHeader {
    cols: CleanupHeaderCols[];
  }
  
  export interface CleanupTable extends Table {
    headers?: CleanupTableHeader[];
  }


  export interface CustomPathHeaderCols extends TableHeaderColumn {
    actionIcon?: boolean;
  }

export interface CustomPathTableHeader {
    cols: CustomPathHeaderCols[];
  }
  
  export interface CustomPathTable extends Table {
    headers?: CustomPathTableHeader[];
  }