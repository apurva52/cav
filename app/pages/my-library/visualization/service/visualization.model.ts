import { SelectItem } from "primeng";
import { ChartConfig } from "src/app/shared/chart/service/chart.model";
import { Table, TableHeader, TableHeaderColumn } from "src/app/shared/table/table.model";

  export interface VisualizationTable {
    storeTier?: SelectItem[];
    iconsField?: any;
    charts: ChartConfig[];
    autocompleteData?: any;
  }