
import { Table, TableHeaderColumn } from 'src/app/shared/table/table.model';

export interface CustomDataHeaderCols extends TableHeaderColumn { }

export interface CustomDataTableHeader {
    cols: CustomDataHeaderCols[];
}

export interface MlocationTable extends Table {
    headers?: CustomDataTableHeader[];
    data: any;


} 
export class addlocationmanage {
    constructor(
        public country:string,
        public state:string,
        public city:string,
        public zone:string,
    ) { }
} 
export class deletlocationmange {
    constructor(
        public city :string,
        public state:string,
        public country:string,
    ) { }
}
