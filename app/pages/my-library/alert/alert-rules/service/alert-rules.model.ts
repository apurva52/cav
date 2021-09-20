import { SelectItem } from 'primeng/api';
import { Table } from 'src/app/shared/table/table.model';
import { Cctx, RuleConfig, Status } from '../alert-configuration/service/alert-config.model';

export interface AlertRuleTable extends Table { 
  iconsField?: any;
  iconsFieldEvent?: any;
  path?: any;
  headers?: any[];
  paginator?: any;
  extensions?: any[];
  status?: Status;
  ruleList?: AlertRule;
}

export interface AlertRule {
  cctx?: Cctx;
  opType?: number;
  rules?: RuleConfig[];
  data?: RuleConfig[];
  status?: Status;
  headers?: any[];
  paginator?: any;
  extensions?: any[];
}

export interface ConfirmMsg {
  header?: string;
  display?: boolean;
  icon?: string;
  body?: string;
  type?: string;
  width?: number;
  height?: number;
}

export interface ActionsEvents {
  enable: boolean,
  minorToMajor ?: boolean;
  minorToCritical ?: boolean;
  majorToMinor ?: boolean;
  majorToCritical ?: boolean;
  criticalToMajor ?: boolean;
  criticalToMinor ?: boolean;
  forceClear ?: boolean;
  continuousEvent ?: boolean;
  endedMinor ?: boolean;
  endedMajor ?: boolean;
  endedCritical ?: boolean;
  startedMinor ?: boolean;
  startedMajor ?: boolean;
  startedCritical ?: boolean;
}

export interface GroupHierarchy extends SelectItem {
  key?: string;
}

