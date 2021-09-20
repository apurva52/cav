
import { SelectItem } from 'primeng';
import { Table, TableHeaderColumn } from 'src/app/shared/table/table.model';


  export interface UserSegmentRuleHeaderCols extends TableHeaderColumn {
    
  }
  
  export interface UserSegmentRuleTableHeader {
    cols: UserSegmentRuleHeaderCols[];
  }
  
  export interface UserSegmentRuleTable extends Table {
      headers?: UserSegmentRuleTableHeader[];
      options: SelectItem[];
      data: any;
    }