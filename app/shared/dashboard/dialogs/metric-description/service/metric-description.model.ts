import { Table } from 'primeng';
import { TableHeaderColumn } from 'src/app/shared/table/table.model';

export interface MetricDescHeaderCols extends TableHeaderColumn {
    
}
export interface MetricDescTableHeader {
    cols: MetricDescHeaderCols[];
  }

export interface MetricDescTable{
    headers: MetricDescTableHeader[];
    data: any;
}