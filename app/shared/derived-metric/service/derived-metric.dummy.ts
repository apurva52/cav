import { InfoData } from '../../dialogs/informative-dialog/service/info.model';
import { DerivedMetricData } from './derived-metric.model';

export const DERIVED_METRIC_DATA: DerivedMetricData = {
  groupName: [
    {
      label: 'Group Name',
      value: 'groupname',
    },
    {
      label: 'Group Name1',
      value: 'groupname1',
    },
    {
      label: 'Group Name2',
      value: 'groupname2',
    },
  ],
  graphName: [
    {
      label: 'Graph Name',
      value: 'graphname',
    },
    {
      label: 'Graph Name1',
      value: 'graphname1',
    },
    {
      label: 'Graph Name2',
      value: 'graphname2',
    },
  ],
  functions: [
    {
      label: 'None',
      value: 'None',
    },
    {
      label: 'Avg',
      value: 'AVG',
    },
    {
      label: 'Max',
      value: 'MAX',
    },
    {
      label: 'Min',
      value: 'MIN',
    },
    {
      label: 'Count',
      value: 'COUNT',
    },
    {
      label: 'SumCount',
      value: 'SUMCOUNT',
    },
    {
      label: 'Sum',
      value: 'SUM',
    },
  ],
  operators: [
    {
      label: 'Log 2',
      value: 'Log2',
    },
    {
      label: 'Log 10',
      value: 'Log10',
    },
    {
      label: 'SampleDiffPct', //Rename due to bug 103442 
      value: 'SampleDiffPct',
    },
    {
      label: '% Away From Tier Average',
      value: 'PctAwayFromTAvg',
    },
    //Remove Sample Diff due to bug 103442 
    // {
    //   label: 'Sample Diff',
    //   value: 'SampleDiff',
    // }
  ],
  rollup: [
    {
      label: 'No Aggregation',
      value: 'No Aggregation',
    },
    {
      label: 'Rollup By',
      value: 'Rollup By',
    },
    {
      label: 'Group By',
      value: 'Group By',
    },
  ],
  by: [
    {
      label: 'Average',
      value: 'Average',
    },
    {
      label: 'Sum',
      value: 'Sum',
    }
  ],
  on: [
    {
      label: 'Tier',
      value: 'Tier',
    },
    {
      label: 'Server',
      value: 'Group By',
    },
    {
      label: 'Instance',
      value: 'Instance',
    }
  ]
};

export const ADDED_GRAPH: any[] = [
  {
    index: 'A',
    groupName: 'groupName',
    graphName: 'graphName',
    indices: 'All',
    function: 'avg',
    operator: 'log',
  },
  {
    index: 'B',
    groupName: 'groupName',
    graphName: 'graphName',
    indices: 'All',
    function: 'avg',
    operator: 'log',
  },
  {
    index: 'C',
    groupName: 'groupName',
    graphName: 'graphName',
    indices: 'All',
    function: 'avg',
    operator: 'log',
  },
];



export const CHART_DUMMY_DATA = {
  "derivedFlag": 6,
  "grpData": {
    "mFrequency": [
      {
        "tsDetail": {
          "st": 1611912660000,
          "count": 10,
          "frequency": 60
        },
        "avgCount": 0,
        "avgcounter": 0,
        "data": [
          {
            "subject": {
              "tags": [
                {
                  "mode": 0,
                  "sMeta": "Tier>Server",
                  "sName": "AppTier>QAServer72",
                  "appName": "Default"
                }
              ]
            },
            "measure": {
              "mgType": "System Metrics",
              "mgTypeId": 0,
              "mg": "SysStats Linux Extended",
              "mgId": 10108,
              "metric": "Processes Waiting For Run Time",
              "metricId": 0,
              "showTogether": 0
            },
            "glbMetricId": "030001000100000000000000060000000800040000000000",
            "dataType": 0,
            "nativeFreq": 60,
            "componentName": "A",
            "avg": [
              -123456789,
              4,
              3,
              6,
              8,
              6,
              5,
              16,
              6,
              11
            ],
            "min": [
              5,
              4,
              3,
              6,
              8,
              6,
              5,
              16,
              6,
              11
            ],
            "max": [
              5,
              4,
              3,
              6,
              8,
              6,
              5,
              16,
              6,
              11
            ],
            "count": [
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              1
            ],
            "sumCount": [
              1,
              2,
              3,
              4,
              5,
              6,
              7,
              8,
              9,
              10
            ],
            "sumSquare": [
              25,
              16,
              9,
              36,
              64,
              36,
              25,
              256,
              36,
              121
            ],
            "baselineGraph": false
          },
          {
            "subject": {
              "tags": [
                {
                  "mode": 0,
                  "sMeta": "Tier>Server",
                  "sName": "AppTier>QAServer2",
                  "appName": "Default"
                }
              ]
            },
            "measure": {
              "mgType": "System Metrics",
              "mgTypeId": 0,
              "mg": "SysStats Linux Extended",
              "mgId": 10108,
              "metric": "Processes Waiting For Run Time",
              "metricId": 0,
              "showTogether": 0
            },
            "glbMetricId": "030001000100000000000000080000000800040000000000",
            "dataType": 0,
            "nativeFreq": 60,
            "componentName": "B",
            "avg": [
              -123456789,
              1,
              2,
              3,
              6,
              14,
              4,
              5,
              2,
              5
            ],
            "min": [
              3,
              1,
              2,
              3,
              6,
              14,
              4,
              5,
              2,
              5
            ],
            "max": [
              3,
              1,
              2,
              3,
              6,
              14,
              4,
              5,
              2,
              5
            ],
            "count": [
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              1
            ],
            "sumCount": [
              1,
              2,
              3,
              4,
              5,
              6,
              7,
              8,
              9,
              10
            ],
            "sumSquare": [
              9,
              1,
              4,
              9,
              36,
              196,
              16,
              25,
              4,
              25
            ],
            "baselineGraph": false
          },
          {
            "subject": {
              "tags": [
                {
                  "mode": 0,
                  "sMeta": "Tier>Server",
                  "sName": "AppTier>QAServer2",
                  "appName": "Default"
                }
              ]
            },
            "measure": {
              "mgType": "System Metrics",
              "mgTypeId": 0,
              "mg": "SysStats Linux Extended",
              "mgId": 10000,
              "metric": "kml",
              "metricId": 0,
              "showTogether": 0
            },
            "glbMetricId": "030001000100000000000000080000000800040000000000",
            "dataType": 0,
            "nativeFreq": 60,
            "componentName": "NA",
            "avg": [
              -123456789,
              10,
              20,
              30,
              60,
              14,
              40,
              50,
              20,
              50
            ],
            "min": [
              3,
              1,
              2,
              3,
              6,
              14,
              4,
              5,
              2,
              5
            ],
            "max": [
              3,
              1,
              2,
              3,
              6,
              14,
              4,
              5,
              2,
              5
            ],
            "count": [
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              1
            ],
            "sumCount": [
              1,
              2,
              3,
              4,
              5,
              6,
              7,
              8,
              9,
              10
            ],
            "sumSquare": [
              9,
              1,
              4,
              9,
              36,
              196,
              16,
              25,
              4,
              25
            ],
            "baselineGraph": false
          }
        ]
      }
    ]
  },
  "rsTime": {
    "1": 2,
    "-1": 30
  },
  "status": {
    "code": 0,
    "msg": "OK"
  }
}

export const CONTENT: InfoData = {
  title: 'Error',
  information: 'Not a valid condition.',
  button: 'Ok'
}

