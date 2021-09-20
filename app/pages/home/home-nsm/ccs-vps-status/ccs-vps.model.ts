
import { Table, TableHeaderColumn } from 'src/app/shared/table/table.model';

export interface CustomDataHeaderCols extends TableHeaderColumn { }

export interface CustomDataTableHeader {
    cols: CustomDataHeaderCols[];
}

export interface CcsVpsTable extends Table {
    headers?: CustomDataTableHeader[];
    data: any;
    headers1?: CustomDataTableHeader[];

}

export interface dataFortable {
    duration: string,
    Downtime: string,
    Uptime: string,
    status: string
    vender: string,
    serverip: string,
    servername: string,
    sl: string
}