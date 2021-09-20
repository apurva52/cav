import {
    TableHeaderColumn,
    Table,
} from 'src/app/shared/table/table.model';




export interface SessionEventTableHeaderColumn extends TableHeaderColumn {
    severityColorField?: boolean;
    iconField?: boolean;
}

export interface SessionEventTableHeader {
    cols: SessionEventTableHeaderColumn[];
}

export interface SessionEventTable extends Table {
    headers?: SessionEventTableHeader[];
    data: any[];
    severityBgColorField?: string;
}