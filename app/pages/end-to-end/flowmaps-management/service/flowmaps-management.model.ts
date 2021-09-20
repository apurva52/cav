import { SelectItem } from 'primeng';
import { Table } from 'src/app/shared/table/table.model';

export interface FlowMapsData {
  flowmapData: Table;
  flowmapOptions: SelectItem[];
  defaultFM : string;
  systemDefaultFM : string;
}

