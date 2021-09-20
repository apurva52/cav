import { SelectItem } from "primeng";
import { Table, TableHeaderColumn } from "src/app/shared/table/table.model";

export interface ProjectHeaderCols extends TableHeaderColumn {
    
  }

export interface ProjectTableHeader {
    cols: ProjectHeaderCols[];
  }
  
  export interface ChannelTable extends Table {
    headers?: ProjectTableHeader[];
    iconField?: any,
   
  }