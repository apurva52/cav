import { SelectItem } from 'primeng';
import { Table, TableHeader, TableHeaderColumn } from 'src/app/shared/table/table.model';

export interface SearchHeaderCols extends TableHeaderColumn {
    
}

export interface SearchTable extends Table {
    headers?: SearchTableHeader[];
    data: any;
    options: SelectItem[];
  }

  
export interface SearchTableHeader {
  cols: SearchHeaderCols[];
}

  