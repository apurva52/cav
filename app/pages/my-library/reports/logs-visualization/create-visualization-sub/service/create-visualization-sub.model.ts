import { MenuItem, SelectItem } from 'primeng';
import { ChartConfig } from 'src/app/shared/chart/service/chart.model';
import { Table, TableHeader, TableHeaderColumn } from 'src/app/shared/table/table.model';


export interface CreateVisualizationData{
  layoutTable : Table;
  visualizationTable : Table;
  storeTier?: SelectItem[];
  autocompleteData?: any;
  iconsField?: any;
}
