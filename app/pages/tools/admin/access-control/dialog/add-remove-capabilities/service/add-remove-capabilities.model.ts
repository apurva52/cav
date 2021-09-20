import { SelectItem } from 'primeng';
import {
  Table,
  TableHeader,
  TableHeaderColumn,
} from 'src/app/shared/table/table.model';

export interface addRemoveCapabilitiesHeaderCols extends TableHeaderColumn {}

export interface addRemoveCapabilitiesTableHeader {
  cols: addRemoveCapabilitiesHeaderCols[];
}

export interface addRemoveCapabilitiesTable extends Table {
  headers?: addRemoveCapabilitiesTableHeader[];
}
