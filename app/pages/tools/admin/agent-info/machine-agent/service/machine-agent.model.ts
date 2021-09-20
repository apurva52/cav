import { SelectItem } from "primeng";
import { Table, TableHeader, TableHeaderColumn } from "src/app/shared/table/table.model";

export interface MachineAgentHeaderCols extends TableHeaderColumn {
    
  }

export interface MachineAgentTableHeader {
    cols: MachineAgentHeaderCols[];
  }
  
  export interface MachineAgentTable extends Table {
    headers?: MachineAgentTableHeader[];
  }