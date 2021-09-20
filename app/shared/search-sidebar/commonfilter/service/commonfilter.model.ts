import { SelectItem } from 'primeng';
import { TableHeaderColumn, Table } from 'src/app/shared/table/table.model';

export interface FilterTable {
 
  timeFrame?: SelectItem[];
  analyzed?: SelectItem[];
  indexed?: SelectItem[];
  type? :SelectItem[];
  timeInternal?: any;
}
