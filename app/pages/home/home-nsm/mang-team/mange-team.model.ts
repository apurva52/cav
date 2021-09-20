
import { Table, TableHeaderColumn } from 'src/app/shared/table/table.model';

export interface CustomDataHeaderCols extends TableHeaderColumn { }

export interface CustomDataTableHeader {
    cols: CustomDataHeaderCols[];
}

export interface MteamTable extends Table {
    headers?: CustomDataTableHeader[];
    data: any;
    headers1?: CustomDataTableHeader[];

} 
export class addteammanage {
    constructor(
        public channel:string,
        public owner:string, 
        public team:string
    ) { }
}
