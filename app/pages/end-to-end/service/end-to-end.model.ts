import { SelectItem, SelectItemGroup } from 'primeng';
import { Legend } from 'src/app/shared/legend/legend.model';
import {
  TableHeader,
  TableSearch,
  TableSort,
  TablePagination,
  Table,
} from 'src/app/shared/table/table.model';

export interface EndToEnd {
  endToEndTableView: Table;
  endToEndLegend: Legend[];
  endToEndMenu: EndToEndMenu;
}

export interface EndToEndGraphicalView {
  node: EndToEndNode[];
  edge: EndToEndEdge[];
}

export interface EndToEndNode {
  transactionScorecard?: TransactionScorecard;
  nodeHealthInfo?: EndToEndNodeInfo[];
  eventAlertCount?: number;
  businessHealthCount?: number;
  serverHealthCount?: number;
  ipHealthCount?: number;
  transactionScorecardCount?: number;
  icon?: string;
  nodeName?: string;
  cpuUtilization?: number;
  avgResTime?: number;
  tps?: number;
  callCount?: number;
  id?: string;
  type?: string;
  coordinates?: number[];
  left?: number;
  top?: number;
}

export interface EndToEndEdge {
  source: string;
  target: string;
}

export interface TransactionScorecard {
  label?: string;
  transScoreSeverity?: TransScoreData[];
}

export interface TransScoreData extends Legend {
  avg?: number;
  data?: number;
  percentage?: number;
}
export interface EndToEndNodeInfo {
  label?: string;
  nodeHealthData?: NodeHealthData[];
}

export interface NodeHealthData extends Legend {
  propValue?: number;
  percentage?: number;
}


export interface EndToEndMenu {
  multiDcNodes?: SelectItem[];
  flowmaps?: SelectItem[];
  nodes?: SelectItemGroup[];
}

export interface Duration {
  st?: number;
  et?: number;
  preset?: string;
  viewBy?: number;
}