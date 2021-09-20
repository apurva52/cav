import {
    TableHeaderColumn,
    Table,
} from 'src/app/shared/table/table.model';




export interface EventsDataTableHeaderColumn extends TableHeaderColumn {
    severityColorField?: boolean;
    iconField?: boolean;
}

export interface EventsDataTableHeader {
    cols: EventsDataTableHeaderColumn[];
}

export interface EventsDataTable extends Table {
    headers?: EventsDataTableHeader[];
    data: any[];
    severityBgColorField?: string;
}

