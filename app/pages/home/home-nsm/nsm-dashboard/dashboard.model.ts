import { SelectItem } from 'primeng'; 
import { ChartConfig } from 'src/app/shared/chart/service/chart.model';
import { Table, TableHeaderColumn } from 'src/app/shared/table/table.model';

export interface CustomDataHeaderCols extends TableHeaderColumn { }

export interface CustomDataTableHeader {
    cols: CustomDataHeaderCols[];
}

export interface CntrollersNameTable extends Table {
    headers?: CustomDataTableHeader[];
    data: any; 
    charts: ChartConfig[];
    
   
}
