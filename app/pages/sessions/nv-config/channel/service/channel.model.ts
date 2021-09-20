import { SelectItem } from "primeng";
import { Table, TableHeaderColumn } from "src/app/shared/table/table.model";

export interface ChannelHeaderCols extends TableHeaderColumn {
    
  }

export interface ChannelTableHeader {
    cols: ChannelHeaderCols[];
  }
  
  export interface ChannelTable extends Table {
    headers?: ChannelTableHeader[];
    // allReports: SelectItem[];
  }