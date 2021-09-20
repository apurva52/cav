import { SelectItem } from 'primeng';
import { ChartConfig } from '../../chart/service/chart.model';

export interface DerivedMetricData {
  groupName: SelectItem[];
  graphName: SelectItem[];
  functions: SelectItem[];
  operators: SelectItem[];
  rollup: SelectItem[];
  by: SelectItem[];
  on: SelectItem[];
}

export interface getGroupListPayload {

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

export interface getGraphPayload {

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
  aggFn?: number,
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
  gdf_mg_id?: number,
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


export const METRIC_CHARTS: ChartConfig = {
  title: '',
  highchart: {
    chart: {
      type: 'spline',
      height: 200,
      width: 1300
    },

    title: {
      text: null,
    },
    legend: {
      enabled: false,
    },
    credits: {
      enabled: false
    },
    xAxis: {
      type: 'datetime',
      dateTimeLabelFormats: {
        millisecond: '%H:%M:%S.%L',
        second: '%H:%M:%S',
        minute: '%H:%M',
        hour: '%H:%M',
        day: '%e. %b',
        week: '%e. %b',
        month: "%b '%y",
        year: '%Y',
      },
    },
    yAxis: {
      title: {
        text: null,
      },
    },
    tooltip: {
      enabled: true,
      backgroundColor: '#ffffff17',
      animation: false,
      followPointer: false,
      valueDecimals: 3,
      style: {
        width: 125,
        fontSize: '10px',
        whiteSpace: 'wrap',
      },
    },
    plotOptions: {
      spline: {
        marker: {
          enabled: false,
          symbol: 'circle',
          radius: 2,
          states: {
            hover: {
              enabled: true,
            },
          },
        },
      },
    },
    series: [

    ] as Highcharts.SeriesOptionsType[],
  },
};

export const SAVE_BUTTON = 1;
export const TEST_BUTTON = 2;
export const ADD_UPDATE_BUTTON = 3;

export const COLOR_ARR = [
  { name: 'A', color: '#9ACD32' },
  { name: 'B', color: '#FF6347' },
  { name: 'C', color: '#00FFFF' },
  { name: 'D', color: '#008080' },
  { name: 'E', color: '#708090' },

  { name: 'F', color: '#0000FF' },

  { name: 'G', color: '#8A2BE2' },
  { name: 'H', color: '#A52A2A' },

  { name: 'I', color: '#DEB887' },

  { name: 'J', color: '#5F9EA0' },
  { name: 'K', color: '#7FFF00' },
  { name: 'L', color: '#D2691E' },
  { name: 'M', color: '#FF7F50' },
  { name: 'N', color: '#6495ED' },
  { name: 'O', color: '#A0522D' },
  { name: 'P', color: '#DC143C' },
  { name: 'Q', color: '#00FFFF' },
  { name: 'R', color: '#00008B' },
  { name: 'S', color: '#B8860B' },
  { name: 'T', color: '#A9A9A9' },
  { name: 'U', color: '#006400' },
  { name: 'V', color: '#BDB76B' },
  { name: 'W', color: '#8B008B' },
  { name: 'X', color: '#FF8C00' },
  { name: 'Y', color: '#9932CC' },
  { name: 'Z', color: '#E9967A' },
]
