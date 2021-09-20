
import { Table, TableHeaderColumn } from 'src/app/shared/table/table.model';

export interface CustomDataHeaderCols extends TableHeaderColumn { }

export interface CustomDataTableHeader {
    cols: CustomDataHeaderCols[];
}

export interface MchannelTable extends Table {
    headers?: CustomDataTableHeader[];
    data: any;
    

} 
export class addchannelmanage {
    constructor(
        public channel:string,
        public owner:string,
        public team:string
    ) { }
} 
export class deletechannelmanage {
    constructor(
        public team:string,
        public channel:string,
    ) { }
}
