
import {
    TableHeaderColumn,
    Table,
} from 'src/app/shared/table/table.model';




export interface AppCrashDataTableHeaderColumn extends TableHeaderColumn {
    severityColorField?: boolean;
    iconField?: boolean;
}

export interface AppCrashDataTableHeader {
    cols: AppCrashDataTableHeaderColumn[];
}

export interface AppCrashDataTable extends Table {
    headers?: AppCrashDataTableHeader[];
    data: any[];
    severityBgColorField?: string;
}
