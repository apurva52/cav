import { SelectItem } from "primeng";
import { Table, TableHeader, TableHeaderColumn } from "src/app/shared/table/table.model";

export interface ApplicationAgentHeaderCols extends TableHeaderColumn {
    
  }

export interface ApplicationAgentTableHeader {
    cols: ApplicationAgentHeaderCols[];
  }
  
  export interface ApplicationAgentTable extends Table {
    headers?: ApplicationAgentTableHeader[];
  }