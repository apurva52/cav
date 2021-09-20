import { TableHeaderColumn, Table } from 'src/app/shared/table/table.model';

export interface ExceptionData {
    panels: ExceptionPanel[];
}
export interface AggregateExceptionData {
    panels: AggregateExceptionPanel[];
}

export interface ExceptionTableHeaderCols extends TableHeaderColumn {
}
export interface AggregateExceptionTableHeaderCols extends TableHeaderColumn {
}

export interface ExceptionTableHeader {
    cols: ExceptionTableHeaderCols[];
}
export interface AggregateExceptionTableHeader {
    cols: AggregateExceptionTableHeaderCols[];
}

export interface ExceptionPanel extends Table {
    label: string;
    headers: ExceptionTableHeader[];
    collapsed?: boolean;
}
export interface AggregateExceptionPanel extends Table {
    label: string;
    headers: AggregateExceptionTableHeader[];
    collapsed?: boolean;
}

export interface ExceptionLoadPayload {

}
export interface AggregateExceptionLoadPayload {

}

export interface SourceCodePayload {
    fqm:string;
    j_uid:string;
    serverName:string;
    tierName:string;
    instanceName:string;
    testRun:string;

}

export interface DownloadSourceCodePayload {
    downloadFileName:string;
    downloadType:string;

}