import { ClientCTX } from 'src/app/core/session/session.model';
import { ChartConfig } from 'src/app/shared/chart/service/chart.model';
import {
  TableHeaderColumn,
  Table,
} from 'src/app/shared/table/table.model';

// export interface MultidiskSettingTableHeaderColumn extends TableHeaderColumn {
//   iconField?: boolean;
//   severityColorField?: boolean;
// }

// export interface MultidiskSettingTableHeader {
//   cols: MultidiskSettingTableHeaderColumn[];
// }

// export interface MultidiskSettingTable {
//   headers?: MultidiskSettingTableHeader;
//   diskSummary?: Table[];
//   severityBgColorField?: string;
// }


export interface MultidiskSettingTableHeaderCols extends TableHeaderColumn {
  severityColorField?: boolean;
  severity?: boolean;
}

export interface MultidiskSettingTableHeader {
  cols: MultidiskSettingTableHeaderCols[];
}
export interface MultidiskSettingTable extends Table { 
  iconsField?: any;
  buttonField?: boolean;
  treetable?: any;
  headers?: MultidiskSettingTableHeader[];
  severityCondition?: any;
  healthCharts: ChartConfig[];
}

