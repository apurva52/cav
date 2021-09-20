import { TableHeaderColumn, Table } from 'src/app/shared/table/table.model';

export interface TemplateHeaderCols extends TableHeaderColumn {
}

export interface TemplateTableHeader {
  cols: TemplateHeaderCols[];
}

export interface TemplateTable extends Table {
  headers?: TemplateTableHeader[];
  headersRead?: TemplateTableHeader[];
}

export interface DeleteTemplate {
  delete: DeleteTemplate [];
}
 
export interface EditTemplate {
  edit: EditTemplate [];
}
