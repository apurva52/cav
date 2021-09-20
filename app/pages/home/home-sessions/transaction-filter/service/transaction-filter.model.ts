import {
  TableHeaderColumn,
  Table,
} from 'src/app/shared/table/table.model';

export interface TransactionFilterTableHeaderColumn extends TableHeaderColumn {
  iconField?: boolean;
  severityColorField?: boolean;
}

export interface TransactionFilterTableHeader {
  cols: TransactionFilterTableHeaderColumn[];
}

export interface TransactionFilterTable extends Table {
  headers?: TransactionFilterTableHeader[];
  data: any;
  severityBgColorField?: string;
}

export interface AutoCompleteData {
    autocompleteData?: any;
}