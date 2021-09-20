import { MenuItem, SelectItem } from 'primeng';
import { ChartConfig } from 'src/app/shared/chart/service/chart.model';
import { Table, TableHeaderColumn } from 'src/app/shared/table/table.model';

export interface LogsTableHeaderCols extends TableHeaderColumn {
    badgeField?: boolean;
  }
  export interface TableHeader {
    cols: LogsTableHeaderCols[];
  }
  export interface LogsData extends Table {
    timestamp: any[];
    tabledata: any[];
    fieldsdata:any[];
    stats:any[];
    headers?: TableHeader[]; 
    storeTier?: SelectItem[];
    iconsField?: any;
    charts: ChartConfig[];
    autocompleteData?: any;
    pattern?: SelectItem[];
  }

export interface LogsData {
    storeTier?: SelectItem[];
    iconsField?: any;
    charts: ChartConfig[];
    autocompleteData?: any;
    pattern?: SelectItem[];
    headers?: TableHeader[]; 
    responseBtns?: any[];
}
export interface Duration {
  gte?: number;
  lte?: number;
  preset?: string;
  viewBy?: number;
}