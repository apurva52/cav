export interface Details {
  gName?: string,
  desc?: string,

}

export interface DataCtx {
  ft?: Ft,
  limit?: number,
  derivedCtx?: DerivedCtx,
  derivedFlag?: number,

}

export interface DerivedCtx {
  details?: Details,
  metricExpression?: MetricExpression[],

}
export interface MetricExpression {

  variable?: Variable[]
  formula?: string,
  aggregation?: Aggregation,
  derivedMName?: string,
  derivedMDesc?: string,


}


export interface GCtx {
  glbMetricId?: string,
  subject?: Subject,
  measure?: Measure,

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

export interface rollUpRequest {
  "opType": number,
  "cctx": {
    "cck": "cavisson.555333.1594548136075",
    "pk": "cavisson.555333.1594548136075",
    "u": "cavisson",
    "prodType": "Netdiagnostics"
  },
  "dataFilter ": [
    1,
    2,
    3
  ],
  "duration": {
    "st": 123,
    "et": 344,
    "viewBy": 60,
    "preset": null
  },
  "tr": 2451,
  "dataCtx": {
    "ft": {
      "typ": [
        0,
        1
      ],
      "in": 0,
      "opt": "=",
      "val1": 777,
      "val2": 888
    },
    "derivedFlag": '',
    "derivedCtx": [
      {
        "details": {
          "gName": "SysStats Linux Extended",
          "desc": "Roll Up Description"
        },
        "metricExpression": [
          {
            "variable": [
              {
                "name": "",
                "varExp": "",
                "gCtx": [
                  {
                    "subject": {
                      "tags": [
                        {
                          "key": "Tier",
                          "mode": 130,
                          "value": "*"
                        },
                        {
                          "key": "Server",
                          "mode": 130,
                          "value": "*"
                        }
                      ]
                    },
                    "measure": {
                      "metric": "CPU Queue (%)",
                      "metricId": 10,
                      "mg": "SysStats Linux Extended",
                      "mgId": 10108,
                      "mgType": "System Metrics",
                      "mgTypeId": -1,
                      "showTogether": 0
                    }
                  }
                ],
                "AggFn": "none",
                "operators": [
                ]
              }
            ],
            "formula": "",
            "aggregation": {
              "type": 0,//RollUp-0,Group By-1, none-2
              "by": 0, // Average-0,Sum -1, none -2
              "level": "Tier" // Tier/Server/Instances/Channels
            },
            "derivedMName": "CPU Queue (%)",
            "derivedMDesc": "Derived Metric Descriptions"
          }
        ]
      }
    ]
  }
}

export interface Cctx {
  cck?: string,
  pk?: string,
  u?: string,
  prodType?: string,

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
