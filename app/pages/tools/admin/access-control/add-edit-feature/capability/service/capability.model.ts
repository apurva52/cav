import { TableHeaderColumn, Table } from 'src/app/shared/table/table.model';

export interface TierHeaderCols extends TableHeaderColumn {
}

export interface TierTableHeader {
  cols: TierHeaderCols[];
}

export interface ProjectHeaderCols extends TableHeaderColumn {
}

export interface ProjectTableHeader {
  cols: TierHeaderCols[];
}

export interface AdvanceHeaderCols extends TableHeaderColumn {
}

export interface AdvanceTableHeader {
  cols: TierHeaderCols[];
}

export interface TierTable extends Table {
  headers?: TierTableHeader[];
}

export interface ProjectTable extends Table {
    headers?: TierTableHeader[];
  }

  export interface AdvancedTable extends Table {
    headers?: TierTableHeader[];
  }



