import { SelectItem } from "primeng";
import { ChartConfig } from "src/app/shared/chart/service/chart.model";
import { Table, TableHeaderColumn } from "src/app/shared/table/table.model";

export interface HavocReportData {
    havocReportTable?: Table;
    options?: SelectItem[];
    havocDistributionCharts?: ChartConfig[];
    havocStateCharts?: ChartConfig[];
  }
  
  export interface HavocReportTableHeader {
    cols: HavocReportHeaderCols[];
  }
  
  export interface HavocReportHeaderCols extends TableHeaderColumn {}