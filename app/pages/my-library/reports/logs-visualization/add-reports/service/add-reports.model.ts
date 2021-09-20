import { MenuItem, SelectItem } from 'primeng';
import { ChartConfig } from 'src/app/shared/chart/service/chart.model';
import { TableHeader } from 'src/app/shared/table/table.model';

export interface AddReportsData {
    storeTier?: SelectItem[];
    iconsField?: any;
    charts: ChartConfig[];
    autocompleteData?: any;
}