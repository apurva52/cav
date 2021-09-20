import { SelectItem } from "primeng";
import { Table, TableHeaderColumn } from "src/app/shared/table/table.model";

export interface MetricsHeaderCols extends TableHeaderColumn {
  actionIcon?: boolean;
  }

export interface MetricsTableHeader {
    cols: MetricsHeaderCols[];
  }
  
  export interface MetricsTable extends Table {
    headers?: MetricsTableHeader[];
    allReports: SelectItem[];
    severityBgColorField?: string;
    iconsField?: any;
  }
  export interface DeleteReport {
    delete: DeleteReport [];
  }
  export interface ReuseReport {
    delete: ReuseReport [];
  }