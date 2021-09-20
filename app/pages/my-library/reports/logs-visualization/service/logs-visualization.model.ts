import { SelectItem } from "primeng";
import { Table, TableHeader, TableHeaderColumn } from "src/app/shared/table/table.model";

export interface LogsVisualizationHeaderCols extends TableHeaderColumn {
    
  }

export interface LogsVisualizationTableHeader {
    cols: LogsVisualizationHeaderCols[];
  }
  
  export interface LogsVisualizationTable extends Table {
    headers?: LogsVisualizationTableHeader[];
  }