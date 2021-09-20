import { SelectItem } from 'primeng';
import { ChartConfig } from '../../chart/service/chart.model';

export interface ScatterMapData {
  dropdownOptions?: DropdownOptions;
  chartMap?: ChartConfig;
}

export interface DropdownOptions {
  loadOptions?: SelectItem[];
  loadTime?: SelectItem[];
}
