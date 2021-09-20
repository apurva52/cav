import { Moment } from "moment-timezone";

export interface GroupData {
  group?: {
    groupName?: string,
    mgId?: number,
    glbMgId?: number,
    metricTypeName?: string,
    vectorType?: boolean,
    hierarchicalComponent?: string
  }[],
  rsTime?: { "100": 100, "101": 101, "102": 102, "103": 103, "104": 104 },
  status?: {
    code?: number,
    msg?: string
  }
}

export interface GraphData {
  graph?: {
    name?: string,
    metricId?: number,
    description?: number,
    glbMetricId?: number
  }[],
  groupDesc?: string,
  groupName?: string,
  glbMgId?: string,
  mgId?: number,
  rsTime?: { "100": 100, "101": 101, "102": 102, "103": 103, "104": 104 },
  status?: {
    code?: number,
    msg?: string
  }
}

export interface RulePayload {
  cctx?: Cctx;
  opType?: number;
  clientId?: string;
  appId?: string;
  rules?: RuleConfig[];
  status?: Status;
}

export interface Cctx {
  cck?: string;
  pk?: string;
  prodType?: string;
  u?: string;
}

export interface Status {
  code?: number;
  msg?: string;
  detailedMsg?: string;
}

export interface RuleConfig {
  id?: number;
  name?: string;
  createdTs?: number;
  lastModifiedTs?: number;
  creator?: string;
  modifiedBy?: string;
  attributes?: AttributesConfig;
}

export interface AttributesConfig {
  enable?: boolean;
  chkStatus?: boolean;
  chkStatusTime?: number;
  level?: number;
  conditionType?: number;
  groups?: string;
  skipSamples?: boolean;
  applyRuleAfter?: number;
  genAlertForNaN?: boolean;
  schedule?: boolean;
  scheduleConfig?: ScheduleConfig[];
  tags?: Tags[];
  metric?: Metric[];
  severity?: Severity[];
  actionsEvents?: ActionsEvents;
  actions?: Actions[];
  mailIds?: string[];
  extensions?: string[];
  message?: string;
  description?: string;
  recommendation?: string;
}

export interface ScheduleConfig {
  type?: number;
  month?: number;
  week?: number;
  day?: number;
  st?: number;
  dayST?: number;
  et?: number;
  zone?: string;
  offset?: number;
}

export interface Tags {
  id?: number;
  name?: string;
  type?: number;
}

export interface Metric {
  mode?: number;
  name?: string;
  subject?: Subject[];
  measure?: Measure;
  glbMetricId?: any;
  derivedFormula?: any;
  attribute?: any;
}

export interface Severity {
  id?: number;
  condition?: string;
  conditionList?: Condition[];
}

export interface ActionsEvents{
  minorToMajor?: boolean;
  minorToCritical?: boolean;
  majorToMinor?: boolean;
  majorToCritical?: boolean;
  criticalToMajor?: boolean;
  criticalToMinor?: boolean;
  forceClear?: boolean;
  continuousEvent?: boolean;
  endedMinor?: boolean;
  endedMajor?: boolean;
  endedCritical?: boolean;
  startedMinor?: boolean;
  startedMajor?: boolean;
  startedCritical?: boolean;
}

export interface Actions {
  id?: number;
  name?: string;
  type?: number;
}

export interface Condition {
  id?: number;
  name?: string;
  type?: number;
  mName?: string;
  thresholdType?: ThresholdType;
  changeType?: ChangeType;
  anomalyType?: AnomalyType;
  outliersType?: OutliersType;
  forcastType?: ForcastType;
}

export interface ThresholdType {
  dataType?: number;
  operator?: number;
  windowType?: number;
  fThreshold?: number;
  sThreshold?: number;
  frThreshold?: number;
  srThreshold?: number;
  pctType?: number;
  pct?: number;
  timeWindow?: number;
  twUnit?: number;
}

export interface ChangeType {
  dataType?: number;
  operator?: number;
  change?: number;
  fThreshold?: number;
  sThreshold?: number;
  frThreshold?: number;
  srThreshold?: number;
  windowType?: number;
  pctType?: number;
  pct?: number;
  timeWindow?: number;
  twUnit?: number;
  pastWindow?: number;
  pwUnit?: number;
}

export interface AnomalyType {
  dataType?: number;
  operator?: number;
  windowType?: number;
  timeWindow?: number;
  twUnit?: number;
  pctType?: number;
  pct?: number;
  algoType?: number;
  deviation?: number;
}

export interface OutliersType {
  dataType?: number;
  timeWindow?: number;
  twUnit?: number;
  pctType?: number;
  pct?: number;
  windowType?: number;
  algoType?: number;
  tolerance?: number;
}

export interface ForcastType {
  dataType?: number;
  operator?: number;
  fThreshold?: number;
  sThreshold?: number;
  frThreshold?: number;
  srThreshold?: number;
  timeWindow?: number;
  twUnit?: number;
  windowType?: number;
  trendWindow?: number;
  trendWindowUnit?: number;
  pctType?: number;
  pct?: number;
  forecastModel?: number;
  forecastType?: number;
}

export interface ScheduleConfiguration {
  id?: number;
  index?: string;
  colorForGraph?: string;
  scheduleType?: any;
  type?: number;
  weekday?: any;
  month?: any;
  week?: any;
  day?: any;
  from?: any;
  to?: any;
  toDate?: Date;
  fromDate?: Date;
  customTimeFrame?: Moment[],
  weekplusday?: any;
  weekplusdayforyear?: any;
  ruleScheduleWeekDayItem?: any;
  ruleScheduleMonthItem?: any;
}

export interface Subject {
  tags: SubjectTags[];
}

export interface SubjectTags {
  key?: string;
  value?: string;
  mode?: number;
}

export interface Measure {
  metric?: string;
  metricId?: number;
  mg?: string;
  mgId?: number;
  mgType?: string;
  mgTypeId?: number;
}

export interface Tag {
  name: string,
  code: string,
  id: number,
  type: number
}

export interface WidgetLoadReq {
  multiDc: boolean;
  actionForAuditLog?: string;
  tsdbCtx: TsdbCTX;
}

export interface TsdbCTX {
  opType?: number;
  appId?: string;
  clientId?: string;
  cctx?: Cctx;
  dataFilter: Array<number>;
  duration?: TsdbCTXDuration;
  tr?: number;
  tsAr?: number;
  tst?: number;
  avgCount?: number;
  avgCounter?: number;
  dataCtx?: DataCTX;
}

export interface TsdbCTXDuration {
  st?: number;
  et?: number;
  preset?: string;
  viewBy?: number;
}

export interface DataCTX {
  derivedFlag?: number;
  gCtx?: GCtx[];
  selfTrend?: number;
  limit: number
}

export interface GCtx {
  subject?: Subject;
  measure?: Measure;
  glbMetricId?: number;
  derivedFormula?: string;
  dataCenter?: string;
}