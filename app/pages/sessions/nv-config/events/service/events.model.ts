import { SelectItem } from 'primeng';
import { Table, TableHeaderColumn } from 'src/app/shared/table/table.model';

export interface EventsTable extends Table { 
  iconsField?: any;
  iconsFieldEvent?: any;
}
