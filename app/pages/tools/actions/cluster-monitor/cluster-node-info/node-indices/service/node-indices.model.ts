import { Table, TableHeaderColumn } from 'src/app/shared/table/table.model';

export interface NodeIndicesData {
  indicesData: IndicesTable;
}

export interface NodeIndicesColumns extends TableHeaderColumn {
  editableCol?: EditableCol;
}
export interface IndicesTableHeader {
  cols: NodeIndicesColumns[];
}

export interface IndicesTable extends Table {
  headers?: IndicesTableHeader[];
}

export interface EditableCol {
  editable?: boolean;
  editType?: string;
}
