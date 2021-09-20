
import { Table, TableHeaderColumn } from 'src/app/shared/table/table.model';

export interface CustomDataHeaderCols extends TableHeaderColumn { }

export interface CustomDataTableHeader {
    cols: CustomDataHeaderCols[];
}

export interface BladeTable extends Table {
    headers?: CustomDataTableHeader[];
    data: any;
    headers1?: CustomDataTableHeader[];

} 

export interface dataFortable {
    Bandwidth: string,
    Allocation: string,
    Owner: string,
    Channel: string,
    Team: string,
    status: string,
    Machine: string,
    Server: string,
    Build: string,
    Uversion: string,
    Controller: string,
    IP: string,
    Name: string,
    Stamp: string,
    Action: string,
    sl: string
}
