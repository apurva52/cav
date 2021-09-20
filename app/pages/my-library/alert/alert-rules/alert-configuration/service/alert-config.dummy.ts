import {AnomalyType, AttributesConfig, ChangeType, Condition, ForcastType, OutliersType, RuleConfig, RulePayload, Severity, Tags, ThresholdType, WidgetLoadReq } from "./alert-config.model";
export const IMAGE_PATH: string = "assets/images/";
export const CRITICAL_SEVERITY: number = 3;
export const MAJOR_SEVERITY: number = 2;
export const MINOR_SEVERITY: number = 1;
export const PAYLOAD_TYPE = {
  GET_RULES: 30,
  ADD_RULE: 31,
  UPDATE_RULE: 32,
  ENABLE_RULE: 33,
  DISABLE_RULE: 34,
  DELETE_RULE: 35,
  IMPORT_RULE: 36,
  EXPORT_RULE: 37,
  DOWNLOAD_RULE: 1,
  DOWNLOAD_ACTION: 2,
  DOWNLOAD_ACTION_HISTORY: 3,
  DOWNLOAD_POLICY: 4,
  DOWNLOAD_MAINTENANACE: 5,
  DOWNLOAD_ACTIVE_ALERT: 6,
  DOWNLOAD_ALERT_HISTORY: 7
}

export const METRIC_ATTRIBUTE: any[] = [
  { label: 'Avg', value: 0 },
  { label: 'Min', value: 1 },
  { label: 'Max', value: 2 },
  { label: 'Count', value: 3 }
]
export const ADDED_GRAPH: any[] = [
  {
    index: 'A',
    colorForGraph: '#e07eff',
    metricGroup: 'System Std Linux',
    metricName: 'Request Per Seconds',
    indices: 'Specified Indices',
  },
  {
    index: 'B',
    colorForGraph: '#54f1f1 ',
    metricGroup: 'System Std Linux',
    metricName: 'Free Memory',
    indices: 'All Indices',
  }
];

export const SCHEDULE_TYPE: any[] = [
  { label: 'next hour', value: 0 },
  { label: 'next day', value: 1 },
  { label: 'next week', value: 2 },
  { label: 'next month', value: 3 },
  //{ label: 'NEXT YEAR', value: 3 },
]

export const CONDITION_TYPE: any[] = [
  { label: 'Threshold', value: 0 },
  { label: 'Change', value: 1 },
  { label: 'Anomaly', value: 2 },
  { label: 'Outlier', value: 3 },
  { label: 'Forecast', value: 4 }
]

export const DATA_TYPE: any[] = [
  { label: 'average', value: 0 },
  { label: 'any', value: 1 },
  { label: 'all', value: 2 },
]

export const DATA_TYPE_THRESHOLD: any[] = [
  { label: 'average', value: 0 },
  { label: 'sum of every', value: 1 },
  { label: 'maximum', value: 2 },
  { label: 'minimum', value: 3 },
  { label: 'at least one', value: 4 },
  { label: 'every', value: 5 },
]

export const DATA_TYPE_ANOMALY: any[] = [
  { label: 'at least one', value: 4 },
  { label: 'every', value: 5 },
]

export const OPERATOR_ANOMALY: any[] = [
  { label: 'above', value: 0 },
  { label: 'below', value: 2 },
  { label: 'above or below', value: 4 }
]

export const OPERATOR: any[] = [
  { label: 'above', value: 0 },
  { label: 'above or equal to', value: 1 },
  { label: 'below', value: 2 },
  { label: 'below or equal to', value: 3 }
]

export const CHANGE: any[] = [
  { label: 'change', value: 0 },
  { label: '%change', value: 1 }
]

export const WINDOW_TYPE: any[] = [
  { label: 'over rolling ', value: 0 },
  { label: 'over fixed ', value: 1 },
];

export const OUTLIER_WINDOW_TYPE: any[] = [
  { label: 'over fixed ', value: 1 },
];

export const Usetheta: any[] = [
  { label: 'theta', value: 0 },
  { label: 'basic', value: 1},
  { label: 'agile', value: 2 },
  { label: 'robust', value: 3 },
];

export const Bounds: any[] = [
  { label: 'above', value: 0 },
  { label: 'below', value: 1 },
];

export const UseMad: any[] = [
  { label: 'MAD', value: 0 },
  { label: 'DBSCAN', value: 1 },
  { label: 'ScaledMAD', value: 2 },
  { label: 'ScaledDBSCAN', value: 3 },
];

export const TIME_WINDOW_UNIT: any[] = [
  { label: 'minutes', value: 0 },
  { label: 'hours', value: 1 },
  { label: 'days', value: 2 },
  { label: 'weeks', value: 3 },
  { label: 'months', value: 4 }
]

export const PCT_TYPE: any[] = [
  { label: 'last', value: 0 },
  { label: 'any', value: 1 }
]

export const ALGO_TYPE: any[] = [
  { label: 'DBSCAN', value: 0 },
  { label: 'ARIMA', value: 1 }
]

export const Sevrity: any[] = [
  { label: 'Critical', value: 3 },
  { label: 'Major', value: 2 },
  { label: 'Minor', value: 1 }
];

export const ForecastModel: any[] = [
  { label: 'default', value: 0 },
  { label: 'simple', value: 1 },
  { label: 'reactive', value: 2 },
];

export const ForecastType: any[] = [
  { label: 'linear', value: 0 },
  { label: 'seasonal', value: 1 },

];

export const TOLERANCE: any[] = [
  { label: '0.33', value: 0.33 },
  { label: '0.5', value: 0.5 },
  { label: '1.0', value: 1.0 },
  { label: '1.5', value: 1.5 },
  { label: '2.0', value: 2.0 },
  { label: '2.5', value: 2.5 },
  { label: '3.0', value: 3.0 },
  { label: '3.5', value: 3.5 },
  { label: '4.0', value: 4.0 },
  { label: '4.5', value: 4.5 },
  { label: '5.0', value: 5.0 },
]

export const METRIC_COLOR_ARR: any[] = [
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

export const COLOR_ARR: any[] = [
  { name: 'C1', color: '#9ACD32' },
  { name: 'C2', color: '#FF6347' },
  { name: 'C3', color: '#00FFFF' },
  { name: 'C4', color: '#008080' },
  { name: 'C5', color: '#708090' },
  { name: 'C6', color: '#0000FF' },
  { name: 'C7', color: '#8A2BE2' },
  { name: 'C8', color: '#A52A2A' },
  { name: 'C9', color: '#DEB887' },
  { name: 'C10', color: '#5F9EA0' },
  { name: 'C11', color: '#7FFF00' },
  { name: 'C12', color: '#D2691E' },
  { name: 'C13', color: '#FF7F50' },
  { name: 'C14', color: '#6495ED' },
  { name: 'C15', color: '#A0522D' },
  { name: 'C16', color: '#DC143C' },
  { name: 'C17', color: '#00FFFF' },
  { name: 'C18', color: '#00008B' },
  { name: 'C19', color: '#B8860B' },
  { name: 'C20', color: '#A9A9A9' },
  { name: 'C21', color: '#006400' },
  { name: 'C22', color: '#BDB76B' },
  { name: 'C23', color: '#8B008B' },
  { name: 'C24', color: '#FF8C00' },
  { name: 'C25', color: '#9932CC' },
  { name: 'C26', color: '#E9967A' },
]

export const PANEL_DUMMY: any = {
  panels: [
    { label: '', collapsed: false },
    { label: '', collapsed: false },
    { label: '', collapsed: false },
    { label: '', collapsed: false },
    { label: '', collapsed: false },
  ],
};

export const TAGS: Tags[] = [
  {id: 1, name: 'Infra', type: 1},
  {id: 2, name: 'Business', type: 1}
]

export const SEVERITY_PANEL_DUMMY: any = {
  panels: [
    {
      label: 'CRITICAL',
      collapsed: false,
      color: '#f12929',
      severity: {
        id: -1,
        condition: null
      },
      condition: {
        type: 0,
        mName: null
      },
      thresholdType: {
        dataType: DATA_TYPE_THRESHOLD[0].value,
        operator: OPERATOR[0].value,
        windowType: WINDOW_TYPE[0].value,
        fThreshold: null,
        sThreshold: null,
        frThreshold: null,
        srThreshold: null,
        pctType: PCT_TYPE[0].value,
        pct: 100,
        timeWindow: 5,
        twUnit: TIME_WINDOW_UNIT[0].value
      },
      changeType: {
        dataType: DATA_TYPE_THRESHOLD[0].value,
        operator: OPERATOR[0].value,
        change: CHANGE[0].value,
        fThreshold: null,
        sThreshold: null,
        frThreshold: null,
        srThreshold: null,
        windowType: WINDOW_TYPE[0].value,
        pctType: PCT_TYPE[0].value,
        pct: 100,
        timeWindow: 5,
        twUnit: TIME_WINDOW_UNIT[0].value,
        pastWindow: 5,
        pwUnit: TIME_WINDOW_UNIT[0].value
      },
      anomalyType: {
        dataType: DATA_TYPE_ANOMALY[0].value,
        operator: OPERATOR_ANOMALY[0].value,
        windowType: WINDOW_TYPE[1].value,
        timeWindow: 5,
        twUnit: TIME_WINDOW_UNIT[0].value,
        pctType: PCT_TYPE[0].value,
        pct: 100,
        algoType: Usetheta[0].value,
        deviation: 2
      },
      outliersType: {
        dataType: DATA_TYPE_ANOMALY[0].value,
        pctType: PCT_TYPE[0].value,
        pct: 100,
        timeWindow: 5,
        twUnit: TIME_WINDOW_UNIT[0].value,
        windowType: WINDOW_TYPE[0].value,
        algoType: UseMad[0].value,
        tolerance: TOLERANCE[0].value
      },
      forcastType: {
        dataType: DATA_TYPE_THRESHOLD[0].value,
        operator: OPERATOR[0].value,
        fThreshold: null,
        sThreshold: null,
        frThreshold: null,
        srThreshold: null,
        timeWindow: 5,
        twUnit: TIME_WINDOW_UNIT[0].value,
        windowType: WINDOW_TYPE[0].value,
        trendWindow: 5,
        trendWindowUnit: TIME_WINDOW_UNIT[0].value,
        pctType: PCT_TYPE[0].value,
        pct: 100,
        forecastModel: ForecastModel[0].value,
        forecastType: ForecastType[0].value
      },
      state: [
        /* {
          index: 'X',
          colorForGraph: '#e07eff',
          condition: 'Threshold',
          metricName: 'Request Per Seconds',
          threshold: '60',
          severity: 'Critical',
          recoveryThreshold: '82'
        },
        {
          index: 'Y',
          colorForGraph: '#54f1f1 ',
          condition: 'Anamoly',
          metricName: 'Free Memory',
          threshold: '60',
          severity: 'Minor',
          recoveryThreshold: '82'
        }, */
      ],
    },
    {
      label: 'MAJOR',
      collapsed: true,
      color: '#ff9898',
      severity: {
        id: -1,
        condition: null
      },
      condition: {
        type: 0,
        mName: null
      },
      thresholdType: {
        dataType: DATA_TYPE_THRESHOLD[0].value,
        operator: OPERATOR[0].value,
        windowType: WINDOW_TYPE[0].value,
        fThreshold: null,
        sThreshold: null,
        frThreshold: null,
        srThreshold: null,
        pctType: PCT_TYPE[0].value,
        pct: 100,
        timeWindow: 5,
        twUnit: TIME_WINDOW_UNIT[0].value
      },
      changeType: {
        dataType: DATA_TYPE_THRESHOLD[0].value,
        operator: OPERATOR[0].value,
        change: CHANGE[0].value,
        fThreshold: null,
        sThreshold: null,
        frThreshold: null,
        srThreshold: null,
        windowType: WINDOW_TYPE[0].value,
        pctType: PCT_TYPE[0].value,
        pct: 100,
        timeWindow: 5,
        twUnit: TIME_WINDOW_UNIT[0].value,
        pastWindow: 5,
        pwUnit: TIME_WINDOW_UNIT[0].value
      },
      anomalyType: {
        dataType: DATA_TYPE_ANOMALY[0].value,
        operator: OPERATOR_ANOMALY[0].value,
        windowType: WINDOW_TYPE[1].value,
        timeWindow: 5,
        twUnit: TIME_WINDOW_UNIT[0].value,
        pctType: PCT_TYPE[0].value,
        pct: 100,
        algoType: Usetheta[0].value,
        deviation: 2
      },
      outliersType: {
        dataType: DATA_TYPE_ANOMALY[0].value,
        timeWindow: 5,
        pctType: PCT_TYPE[0].value,
        pct: 100,
        twUnit: TIME_WINDOW_UNIT[0].value,
        windowType: WINDOW_TYPE[0].value,
        algoType: UseMad[0].value,
        tolerance: TOLERANCE[0].value
      },
      forcastType: {
        dataType: DATA_TYPE_THRESHOLD[0].value,
        operator: OPERATOR[0].value,
        fThreshold: null,
        sThreshold: null,
        frThreshold: null,
        srThreshold: null,
        timeWindow: 5,
        twUnit: TIME_WINDOW_UNIT[0].value,
        windowType: WINDOW_TYPE[0].value,
        trendWindow: 5,
        trendWindowUnit: TIME_WINDOW_UNIT[0].value,
        pctType: PCT_TYPE[0].value,
        pct: 100,
        forecastModel: ForecastModel[0].value,
        forecastType: ForecastType[0].value
      },
      state: [
        /* {
          index: 'X',
          colorForGraph: '#e07eff',
          condition: 'Threshold',
          metricName: 'Request Per Seconds',
          threshold: '85',
          severity: 'Major',
          recoveryThreshold: '83'
        },
        {
          index: 'Y',
          colorForGraph: '#54f1f1 ',
          condition: 'Anamoly',
          metricName: 'Free Memory',
          threshold: '60',
          severity: 'Minor',
          recoveryThreshold: '83'
        }, */
      ],
    },
    {
      label: 'MINOR',
      collapsed: true,
      color: '#ffc9c9',
      severity: {
        id: -1,
        condition: null
      },
      condition: {
        type: 0,
        mName: null
      },
      thresholdType: {
        dataType: DATA_TYPE_THRESHOLD[0].value,
        operator: OPERATOR[0].value,
        windowType: WINDOW_TYPE[0].value,
        fThreshold: null,
        sThreshold: null,
        frThreshold: null,
        srThreshold: null,
        pctType: PCT_TYPE[0].value,
        pct: 100,
        timeWindow: 5,
        twUnit: TIME_WINDOW_UNIT[0].value
      },
      changeType: {
        dataType: DATA_TYPE_THRESHOLD[0].value,
        operator: OPERATOR_ANOMALY[0].value,
        change: CHANGE[0].value,
        fThreshold: null,
        sThreshold: null,
        frThreshold: null,
        srThreshold: null,
        windowType: WINDOW_TYPE[0].value,
        pctType: PCT_TYPE[0].value,
        pct: 100,
        timeWindow: 5,
        twUnit: TIME_WINDOW_UNIT[0].value,
        pastWindow: 5,
        pwUnit: TIME_WINDOW_UNIT[0].value
      },
      anomalyType: {
        dataType: DATA_TYPE_ANOMALY[0].value,
        operator: OPERATOR[0].value,
        windowType: WINDOW_TYPE[1].value,
        timeWindow: 5,
        twUnit: TIME_WINDOW_UNIT[0].value,
        pctType: PCT_TYPE[0].value,
        pct: 100,
        algoType: Usetheta[0].value,
        deviation: 2
      },
      outliersType: {
        dataType: DATA_TYPE_ANOMALY[0].value,
        timeWindow: 5,
        pctType: PCT_TYPE[0].value,
        pct: 100,
        twUnit: TIME_WINDOW_UNIT[0].value,
        windowType: WINDOW_TYPE[0].value,
        algoType: UseMad[0].value,
        tolerance: TOLERANCE[0].value
      },
      forcastType: {
        dataType: DATA_TYPE_THRESHOLD[0].value,
        operator: OPERATOR[0].value,
        fThreshold: null,
        sThreshold: null,
        frThreshold: null,
        srThreshold: null,
        timeWindow: 5,
        twUnit: TIME_WINDOW_UNIT[0].value,
        windowType: WINDOW_TYPE[0].value,
        trendWindow: 5,
        trendWindowUnit: TIME_WINDOW_UNIT[0].value,
        pctType: PCT_TYPE[0].value,
        pct: 100,
        forecastModel: ForecastModel[0].value,
        forecastType: ForecastType[0].value
      },
      state: [
        /* {
          index: 'X',
          colorForGraph: '#e07eff',
          condition: 'Threshold',
          metricName: 'Request Per Seconds',
          threshold: '85',
          severity: 'Major',
          recoveryThreshold: '83'
        },
        {
          index: 'Y',
          colorForGraph: '#54f1f1 ',
          condition: 'Anamoly',
          metricName: 'Free Memory',
          threshold: '60',
          severity: 'Minor',
          recoveryThreshold: '83'
        }, */
      ],
    },
  ],
};

export const CONDITION: Condition = {
  type: 0
}

export const RULES: RuleConfig = {
  name: null,
  id: -1
}

export const SEVERITY: Severity = {
  condition: null,
  conditionList: []
}

export const ATTRIBUTES_CONFIG: AttributesConfig = {
  enable: true,
  chkStatus: true,
  chkStatusTime: 15,
  level: 0,
  conditionType: 0,
  groups: null,
  skipSamples: false,
  genAlertForNaN: false,
  severity: [],
  metric: [],
  schedule: false,
  mailIds: [],
  extensions: [],
  message: null,
  description: null,
  recommendation: null,
}
export const RULE_DATA: RulePayload = {
  cctx: null,
  opType: -1,
  rules: [
    {
      id: -1,
      name: "",
      createdTs: -1,
      lastModifiedTs: -1,
      creator: "cavisson",
      modifiedBy: "uttam",
      attributes: {
        enable: true,
        chkStatus: false,
        chkStatusTime: 1800000,
        level: 0,
        conditionType: 0,
        groups: "Tier>Server",
        skipSamples: true,
        genAlertForNaN: true,
        schedule: false,
        scheduleConfig: [
          {
            type: 0,
            month: 0,
            week: 0,
            day: 0,
            st: 0,
            et: 0
          }
        ],
        tags: [
          {
            id: 1,
            name: "BusnessRule"
          }
        ],
        metric: [
          {
            name: "A",
            subject: [
              {
              tags: [
                {
                  key: "Tier",
                  value: "cprod-mysql-batch",
                  mode: 1
                },
                {
                  key: "Server",
                  value: "Overall",
                  mode: 1
                }
              ]
            }],
            measure: {
              metric: "Sessions Started/Minute",
              metricId: 9,
              mg: "Business Transactions",
              mgId: 10245,
              mgType: "Application Metrics",
              mgTypeId: -1
            },
            glbMetricId: null,
            attribute: 0
          }
        ],
        severity: [
          {
            id: 0,
            condition: "",
            conditionList: [
              {
                id: 1,
                name: "C1",
                type: 0,
                mName: null,
                thresholdType: {
                  dataType: DATA_TYPE_THRESHOLD[0].value,
                  operator: OPERATOR[0].value,
                  windowType: WINDOW_TYPE[0].value,
                  fThreshold: null,
                  sThreshold: null,
                  frThreshold: null,
                  srThreshold: null,
                  pctType: PCT_TYPE[0].value,
                  pct: 100,
                  timeWindow: 5,
                  twUnit: TIME_WINDOW_UNIT[0].value
                },
                changeType: {
                  dataType: DATA_TYPE_THRESHOLD[0].value,
                  operator: OPERATOR[0].value,
                  change: CHANGE[0].value,
                  fThreshold: null,
                  sThreshold: null,
                  frThreshold: null,
                  srThreshold: null,
                  windowType: WINDOW_TYPE[0].value,
                  pctType: PCT_TYPE[0].value,
                  pct: 100,
                  timeWindow: 5,
                  twUnit: TIME_WINDOW_UNIT[0].value,
                  pastWindow: 5,
                  pwUnit: TIME_WINDOW_UNIT[0].value
                },
                anomalyType: {
                  dataType: DATA_TYPE_ANOMALY[0].value,
                  operator: OPERATOR_ANOMALY[0].value,
                  windowType: WINDOW_TYPE[1].value,
                  timeWindow: 5,
                  twUnit: TIME_WINDOW_UNIT[0].value,
                  pctType: PCT_TYPE[0].value,
                  pct: 100,
                  algoType: Usetheta[0].value,
                  deviation: 2
                },
                outliersType: {
                  dataType: DATA_TYPE_ANOMALY[0].value,
                  timeWindow: 5,
                  pctType: PCT_TYPE[0].value,
                  pct: 100,
                  twUnit: TIME_WINDOW_UNIT[0].value,
                  windowType: WINDOW_TYPE[0].value,
                  algoType: UseMad[0].value,
                  tolerance: TOLERANCE[0].value
                },
                forcastType: {
                  dataType: DATA_TYPE_THRESHOLD[0].value,
                  operator: OPERATOR[0].value,
                  fThreshold: null,
                  sThreshold: null,
                  frThreshold: null,
                  srThreshold: null,
                  timeWindow: 5,
                  twUnit: TIME_WINDOW_UNIT[0].value,
                  windowType: WINDOW_TYPE[0].value,
                  trendWindow: 5,
                  trendWindowUnit: TIME_WINDOW_UNIT[0].value,
                  pctType: PCT_TYPE[0].value,
                  pct: 100,
                  forecastModel: ForecastModel[0].value,
                  forecastType: ForecastType[0].value
                }
              }
            ]
          }
        ],
        actionsEvents: {
          minorToMajor: false,
          minorToCritical: false,
          majorToMinor: false,
          majorToCritical: false,
          criticalToMajor: false,
          criticalToMinor: false,
          forceClear: false,
          continuousEvent: false,
          endedMinor: false,
          endedMajor: false,
          endedCritical: false,
          startedMinor: false,
          startedMajor: false,
          startedCritical: false
        },
        actions: [
          {
            id: 1,
            name: "take mail"
          }
        ],
        mailIds: [],
        extensions: [],
        message: "",
        description: "",
        recommendation: ""
      }
    }
  ]
}

export const GRAPH_REQEST: WidgetLoadReq = {
  "multiDc": false,
  "tsdbCtx": {
    "appId": "-1",
    "avgCount": 0,
    "avgCounter": 0,
    "cctx": {
      "cck": "guest.2452.1621128716994",
      "pk": "guest:192.168.8.22:05-16-2021 07-01-55",
      "u": "guest",
      "prodType": "NetDiagnostics"
    },
    "clientId": "",
    "dataFilter": [
      0,
      1,
      2,
      3,
      4,
      5
    ],
    "dataCtx": {
      "derivedFlag": -1,
      "gCtx": [
        {
          "measure": {
            "mgType": "System status",
            "mgTypeId": -1,
            "mg": "SysStats Linux Extended",
            "mgId": 10108,
            "metric": "CPU Utilization (Pct)",
            "metricId": 18
          },
          "subject": {
            "tags": [
              {
                "key": "Tier",
                "value": "AppTier",
                "mode": 1
              },
              {
                "key": "Server",
                "value": "QAServer2",
                "mode": 1
              }
            ]
          }
        }
      ],
      "selfTrend": 0,
      "limit": 0
    },
    "duration": {
      "st": 1621128719327,
      "et": 1621129319327,
      "preset": "LIVE1",
      "viewBy": 60
    },
    "opType": 11,
    "tr": 2452
  },
  "actionForAuditLog": null
}



