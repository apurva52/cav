
import { Table, TableHeaderColumn } from 'src/app/shared/table/table.model';

export interface CustomDataHeaderCols extends TableHeaderColumn { }

export interface CustomDataTableHeader {
    cols: CustomDataHeaderCols[];
}

export interface VendersTable extends Table {
    headers?: CustomDataTableHeader[];
    data: any;
    headers1?: CustomDataTableHeader[];

} 
export class addvenders {
    constructor(
        public channel: string,
       
    ) { }
}
