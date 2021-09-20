import {
    TableHeaderColumn,
    Table,
} from 'src/app/shared/table/table.model';




export interface HttpDataTableHeaderColumn extends TableHeaderColumn {
    severityColorField?: boolean;
    iconField?: boolean;
}

export interface HttpDataTableHeader {
    cols: HttpDataTableHeaderColumn[];
}

export interface HttpDataTable extends Table {
    headers?: HttpDataTableHeader[];
    data: any[];
    severityBgColorField?: string;
}


