import { TableHeader, TableSort, TablePagination } from '../../table/table.model';

export interface LowerPanelTable {
    headers: TableHeader[];
    sort: TableSort;
    paginator: TablePagination;
    data: any[];
    selected: any[];
    visibleGraph: any[];
}
