import { SelectItem, SelectItemGroup } from 'primeng';
import { Legend } from 'src/app/shared/legend/legend.model';

export interface EndToEndGraphical {
  endToEndGraphicalView: EndToEndGraphicalView;
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
  businessHealthMajorCircum?:number;
  businessHealthCriticalCircum?:number;
  serverHealthMajorCircum?:number;
  serverHealthCriticalCircum?:number
  serverHealthCount?: number;
  ipHealthCount?: number;
  transactionScorecardCount?: number;
  icon?: string;
  nodeName?: string;
  from?: string;
  to?: string;
  cpuUtilization?: number;
  avgResTime?: number;
  tps?: number;
  callCount?: number;
  count?: number;
  callSec?: number;
  errorCount?: number;
  errorSec?: number;
  id?: string;
  type?: string;
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
  showCallsSettings?: SelectItem[];
  valuesSettings?: SelectItem[];
}

// Edit Option model
export interface EndToEndEditData {
  dropdownOptions: EndToEndEditOptions;
}

export interface EndToEndEditOptions {
  tierSearch?: customSelectItem[];
  transactionPerSecond?: SelectItem[];
  responseTime?: SelectItem[];
  cpuUtilization?: SelectItem[];
}

export interface customSelectItem extends SelectItem{
  visible?:boolean;
}

export interface Duration {
  st?: number;
  et?: number;
  preset?: string;
  viewBy?: number;
}
