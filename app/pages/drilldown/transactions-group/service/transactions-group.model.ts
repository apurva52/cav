import {
  Table, TableHeader
} from 'src/app/shared/table/table.model';

export interface TransactionGroupTable extends Table {
  headers?: TableHeader[];
  severityBgColorField?: string;
}

