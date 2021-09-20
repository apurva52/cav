import { SelectItem } from "primeng";
import { Table, TableHeaderColumn } from "src/app/shared/table/table.model";

export interface MonitorsHeaderCols extends TableHeaderColumn {
  actionIcon?: boolean;
  }

export interface MonitorsTableHeader {
    cols: MonitorsHeaderCols[];
  }
  
  export interface MonitorsTable extends Table {
    headers?: MonitorsTableHeader[];
    allReports: SelectItem[];
    severityBgColorField?: string;
    iconsField?: any;
  }


  export interface MonitorGroupHeaderCols extends TableHeaderColumn {
    actionIcon?: boolean;
    }
  
  export interface MonitorGroupTableHeader {
      cols: MonitorGroupHeaderCols[];
    }
    
    export interface MonitorGroupTable extends Table {
      headers?: MonitorGroupTableHeader[];

      iconsField?: any;
    }