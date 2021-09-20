import { SelectItem } from 'primeng';

import { Table, TableHeaderColumn } from '../../../../shared/table/table.model'


export interface CustomDataHeaderCols extends TableHeaderColumn { }

export interface CustomDataTableHeader {
    cols: CustomDataHeaderCols[];
}

export interface ProjectAllocationTable extends Table {
    headers?: CustomDataTableHeader[];
    data: any;



}
