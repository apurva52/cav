import {
    TableHeaderColumn,
    Table,
} from 'src/app/shared/table/table.model';




export interface UserTimingDataTableHeaderColumn extends TableHeaderColumn {
    severityColorField?: boolean;
    iconField?: boolean;
}

export interface UserTimingDataTableHeader {
    cols: UserTimingDataTableHeaderColumn[];
}

export interface UserTimingDataTable extends Table {
    headers?: UserTimingDataTableHeader[];
    data: any[];
    severityBgColorField?: string;
}


