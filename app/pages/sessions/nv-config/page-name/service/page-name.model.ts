import { SelectItem } from 'primeng';
import { Table, TableHeaderColumn } from 'src/app/shared/table/table.model';

export interface CustomDataHeaderCols extends TableHeaderColumn {}

export interface CustomDataTableHeader {
  cols: CustomDataHeaderCols[];
}

export interface PageNameTable extends Table {
  headers?: CustomDataTableHeader[];
  data: any; 
  Display : boolean;
} 

export interface ToolTip {
  classname: string
  title: string

}

export const TitleData: ToolTip[] = [
  { classname: ".pi-caret-left", title: 'Previous' },
  { classname: ".pi-caret-right", title: 'Next' },
  { classname: ".pi-step-forward", title: 'Move to last' },
  { classname: ".pi-step-backward", title: 'Move to first' },
]
