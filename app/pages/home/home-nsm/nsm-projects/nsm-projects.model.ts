
//import { Table, TableHeaderColumn } from 'src/app/shared/table/table.model'; 
import { Table, TableHeaderColumn} from '../../../../shared/table/table.model'

export interface CustomDataHeaderCols extends TableHeaderColumn { }

export interface CustomDataTableHeader {
    cols: CustomDataHeaderCols[];
}

export interface ProjectsTable extends Table {
    headers?: CustomDataTableHeader[];
    data: any;
    

}
