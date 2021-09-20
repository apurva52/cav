import {
  TableHeaderColumn,
  Table,
} from 'src/app/shared/table/table.model';

export interface HelpRelatedMetricsTableHeaderCols extends TableHeaderColumn {
  rowColorField?: boolean;
}
export interface TableHeader {
  cols: HelpRelatedMetricsTableHeaderCols[];
}

export interface HelpRelatedMetricsTable extends Table {
  headers?: TableHeader[];
  iconsField?: any;
}

