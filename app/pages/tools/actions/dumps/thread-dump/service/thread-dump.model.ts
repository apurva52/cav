import {
  Table,
  TableHeader,
  TableHeaderColumn,
} from 'src/app/shared/table/table.model';

export interface ThreadDumpData {
  threadData?: ThreadDumpTable;
}

export interface ThreadDumpTableHeaderColumn extends TableHeaderColumn {
  showInThread?: boolean;
  editableCol?: EditableCol;
}

export interface ThreadDumpTableHeader extends TableHeader {
  cols: ThreadDumpTableHeaderColumn[];
}

export interface ThreadDumpTable extends Table {
  headers: ThreadDumpTableHeader[];
}

export interface EditableCol {
  editable?: boolean;
  editType?: string;
}