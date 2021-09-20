
import { Table, TableHeaderColumn } from 'src/app/shared/table/table.model';

export interface CustomDataHeaderCols extends TableHeaderColumn { }

export interface CustomDataTableHeader {
    cols: CustomDataHeaderCols[];
}

export interface allocationTable extends Table {
    headers?: CustomDataTableHeader[];
    data: any;
    headers1?: CustomDataTableHeader[];

} 

export interface dataFortable { 

   
    sl: string, 
    User: string, 
    Stamp: string,
    Comments: string,
}

