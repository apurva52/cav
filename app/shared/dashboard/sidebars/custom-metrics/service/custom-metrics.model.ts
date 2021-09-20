import { SelectItem } from 'primeng';
export interface CustomMetrics {}

export interface TreeResult {
  children?: TreeResult[];
  hasChildren: boolean;
  graphID: number | null;
  groupID: number | null;
  groupTypeVector: boolean;
  lastHierarchicalComponent: boolean;
  matched: boolean;
  metricsName: string | null;
  nodeType: 0 | 1 | 2 | 3;
  specialNode: boolean;
  state: 'OPENED' | 'DISABLED' | 'SELECTED';
  text: string;
  type: string;
}

export interface Data  {
  description?: string;
  glbMetricId?: number;
  metricId?: number;
  name?: string;
}

export interface GraphDataResponse {
  glbMgId?: string;
  graph?: Data[];
  groupDesc? : string;
  groupName?: string;
  mgId?: number;
  rsTime?: any ;
  status?: any;
}

export interface TreeNodeMenu {
  tree?: any;
  children?: TreeNodeMenu[];
  parent?: TreeNodeMenu;
  typeId?: number;
  name?: string;
  gdfId?: number;
  id?: string;
  matched?: boolean;
  label?: string;
  data?: any;
  icon?: any;
  expandedIcon?: any;
  collapsedIcon?: any;
  leaf?: boolean;
  expanded?: boolean;
  type?: string;
  partialSelected?: boolean;
  styleClass?: string;
  draggable?: boolean;
  droppable?: boolean;
  selectable?: boolean;
  key?: string;
  showMenu? : boolean;
  showSecondLevelMenu?: boolean;
  level? : number;
  mgId? : number;
  glbMgId?: string;
  metricTypeName?: string;
  vectorType?: boolean;
  hierarchicalComponent?: string;
  description?: string;
	metricId?: number;
	groupName?: string;
	groupDesc?: string;
}




export interface DerivedMetricData {
  groupName: SelectItem[];
  graphName: SelectItem[];
  functions: SelectItem[];
  operators: SelectItem[];
  rollup: SelectItem[];
  by: SelectItem[];
  on: SelectItem[];
}

export interface GroupListPayload {

  opType: string,
  cctx: {
    cck: string,
    pk: string,
    prodType: string,
    u: string
  },
  duration: {
    et: number,
    preset: string,
    st: number,
    viewBy: number
  },
  tr: string,
  clientId: string,
  appId: string,
  selVector: string
}

export interface GraphListPayload {

  opType: string,
  cctx: {},
  duration: {},
  tr: string,
  clientId: string,
  appId: string,
  mgId: string,
  glbMgId: string,
  grpName: string


}

export interface groupData {
  group:
  {
    groupName: string,
    mgId: number,
    glbMgId: number,
    metricTypeName: string,
    vectorType: boolean,
    hierarchicalComponent: string
  }[],
  rsTime: { "100": 100, "101": 101, "102": 102, "103": 103, "104": 104 },
  status: {
    code: number,
    msg: string
  }
}

export interface graphData {
  graph: {
    name: string,
    metricId: number,
    description: number,
    glbMetricId: number
  }[],
  groupDesc: string,
  groupName: string,
  glbMgId: string,
  mgId: number,
  rsTime: { "100": 100, "101": 101, "102": 102, "103": 103, "104": 104 },
  status: {
    code: number,
    msg: string
  }
}



export interface Cctx {
  cck?: string,
  pk?: string,
  u?: string,
  prodType?: string,

}
export interface Duration {
  st?: number,
  et?: number,
  viewBy?: number,
  preset?: string,
}

export interface Ft {

  typ?: number[]
  in?: number,
  opt?: string,
  val1?: number,
  val2?: number,
}

export interface Details {
  gName?: string,
  desc?: string,

}


export interface Tags {
  key?: string,
  mode?: number,
  value?: string,
}

export interface Subject {
  tags?: Tags[],

}
export interface Measure {
  metric?: string,
  metricId?: number,
  mg?: string,
  mgId?: number,
  mgType?: string,
  mgTypeId?: number,
  showTogether?: number,

}


export interface GCtx {
  glbMetricId?: string,
  subject?: Subject,
  measure?: Measure,

}







export interface Variable {

  name?: string,
  varExp?: string,
  gCtx?: GCtx[],
  AggFn?: string,
  operators?: number[]

}

export interface Aggregation {
  type?: number,
  by?: number,
  level?: string,
}

export interface MetricExpression {

  variable?: Variable[]
  formula?: string,
  aggregation?: Aggregation,
  derivedMName?: string,
  derivedMDesc?: string,


}






export interface DerivedCtx {
  details?: Details,
  metricExpression?: MetricExpression[],

}


export interface DataCtx {
  ft?: Ft,
  limit?: number,
  derivedCtx?: DerivedCtx,
  derivedFlag?: number,

}



export interface DerivedRequestPayLoad {

  opType?: number;
  cctx?: Cctx;
  dataFilter?: number[];
  duration?: Duration;
  tr?: number,
  clientId?: string,
  appId?: string,
  dataCtx?: DataCtx,


}


/**    Response  */

export interface DashboardWidgetLoadRes {
  cctx?: Cctx;
  grpData?: DashboardGraphData;
  status?: WidgetLoadResStatus;
}

export interface DashboardGraphData {
  mFrequency?: DashboardGraphDataMFrequency[];
}

export interface MFrequencyTsDetails {
  count?: number;
  frequency?: number;
  st?: number;
}


export interface DashboardGraphDataMFrequency {
  avgCount?: number;
  avgCounter?: number;
  bucketName?: string[];
  data?: GraphData[];
  tsDetail?: MFrequencyTsDetails;
}

export interface WidgetLoadResStatus {
  code?: number;
  mgs?: string;
  rsTime?: number;
}

export interface GraphData {
  avg?: number[];
  count?: number[];
  baselineGraph?: boolean;
  dataType?: number;
  glbMetricId?: number;
  max?: number[];
  measure?: DashboardGraphDataCTXMeasure;
  min?: number[];
  nativeFreq?: number;
  percentile?: number[];
  sumSquare?: number[];
  slabCount?: number[];
  slabName?: string[];
  subject?: GraphDataCTXSubject;
  sumCount?: number[];
  summary?: GraphDataSummary;
  componentName?: string;
}

export interface GraphDataSummary {
  avg?: number;
  count?: number;
  lastSample?: number;
  max?: number;
  min?: number;
  stdDev?: number;
}

export interface GraphDataCTXSubject {
  tags?: GraphDataCTXSubjectTag[];
}

export interface GraphDataCTXSubjectTag {
  appName?: string;
  key?: string;
  value?: string;
  sName?: string;
  sMeta?: string;
  mode?: number;
}

export interface DashboardGraphDataCTXMeasure {
  mgType?: string;
  mgTypeId?: number;
  mg?: string;
  mgId?: number;
  metric?: string;
  metricId?: number;
}

export interface hierarchicalData {

}

export interface hierarchicalPayload {

  opType: number,
  tr: number,
  cctx: {
    cck: string,
    pk: string,
    u: string,
    prodType: string
  },
  duration: {
    st: number,
    et: number,
    preset: string
  },
  clientId: string,
  appId: string,
  glbMgId: string,
  derivedMetricId: number

}

export interface DeleteDerivedPayload {

  opType: string,
  cctx: {
    cck: string,
    pk: string,
    prodType: string,
    u: string
  },
  duration: {
    et: number,
    preset: string,
    st: number,
    viewBy: number
  },
  tr: string,
  clientId: string,
  appId: string,
  glbMgId: string,
  derivedMetricId: number,
  flag: number,
  rollUpLevel: number,
  mgName: string,
  metricName: string
}


export interface ViewDerivedExpPayload {

  opType: string,
  cctx: {
    cck: string,
    pk: string,
    prodType: string,
    u: string
  },
  duration: {
    et: number,
    preset: string,
    st: number,
    viewBy: number
  },
  tr: string,
  clientId: string,
  appId: string,
  metricGroupId: number
  metricId: number,
  type : number,
  mgName: string,
  metricName : string
}

export interface DeleteDerivedData {

}

export interface ViewDerivedExpData {

}




