import {
  TableSearch,
  TableSort,
  TablePagination,
  TableHeaderColumn,
  TableHeader,
} from 'src/app/shared/table/table.model';

export interface TableBoxTable {
  headers?: TableHeader[];
  data?: any[];
  search?: TableSearch;
  sort?: TableSort;
  paginator?: TablePagination;
  readField?: string;
}
