import { FlowpathAnalyzerData } from './flowpath-analyzer.model';


export const FLOWPATH_ANALYZER_TABLE: FlowpathAnalyzerData = {
  panels: [
    {
      paginator: {
        first: 1,
        rows: 33,
        rowsPerPageOptions: [3, 5, 10, 25, 50, 100],
      },
      tableFilter: false,

      label: 'Pattern Stats',
      collapsed: true,
      searchOption: false,
      headers: [
        {
          cols: [
            {
              label: 'Signature',
              valueField: 'signature',
              filter: {
                isFilter: true,
                type: 'contains',
              },
            },
            {
              label: 'FlowPath Count',
              valueField: 'flowPathcount',
              classes: 'text-right',
              filter: {
                isFilter: true,
                type: 'contains',
              },
            },
            {
              label: 'Age',
              valueField: 'age',
              classes: 'text-right',
              filter: {
                isFilter: true,
                type: 'contains',
              },
            },
            {
              label: 'Max',
              valueField: 'max',
              classes: 'text-right',
              filter: {
                isFilter: true,
                type: 'contains',
              },
            },
            {
              label: 'Min',
              valueField: 'min',
              classes: 'text-right',
              filter: {
                isFilter: true,
                type: 'contains',
              },
            },

          ],
        },
      ],
      data: [
        {
          signature: 'Signature1',
          flowPathcount: '25',
          age: '32',
          max: '1',
          min: '0'
        }
      ]
    },
    {
      paginator: {
        first: 1,
        rows: 33,
        rowsPerPageOptions: [3, 5, 10, 25, 50, 100],
      },
      label: 'Flowpath Signature',
      collapsed: true,
      searchOption: false,
      headers: [
        {
          cols: [
            {
              label: 'Signature',
              valueField: 'signature',
              filter: {
                isFilter: true,
                type: 'contains',
              },
            },
            {
              label: 'FlowPath Count',
              valueField: 'flowPathcount',
              filter: {
                isFilter: true,
                type: 'contains',
              },
            },
            {
              label: 'Age',
              valueField: 'age',
              filter: {
                isFilter: true,
                type: 'contains',
              },
            },
            {
              label: 'Max',
              valueField: 'max',
              filter: {
                isFilter: true,
                type: 'contains',
              },
            },
            {
              label: 'Min',
              valueField: 'min',
              filter: {
                isFilter: true,
                type: 'contains',
              },
            },

          ],
        },
      ],
      data: [
        {
          signature: 'Signature1',
          flowPathcount: '25',
          age: '32',
          max: '1',
          min: '0'
        }
      ]
    },
    {
      paginator: {
        first: 1,
        rows: 33,
        rowsPerPageOptions: [3, 5, 10, 25, 50, 100],
      },
      label: 'Pattern Summary',
      collapsed: true,
      searchOption: false,
      headers: [
        {
          cols: [
            {
              label: 'Pattern',
              valueField: 'pattern',
              filter: {
                isFilter: true,
                type: 'contains',
              },
            },
            {
              label: 'FlowPath Avg Time(ms)',
              valueField: 'avgTime',
              filter: {
                isFilter: true,
                type: 'contains',
              },
            },
            {
              label: 'FlowPath Count',
              valueField: 'flowPathcount',
              filter: {
                isFilter: true,
                type: 'contains',
              },
            },
            {
              label: 'Percentage FlowPath',
              valueField: 'percentageFlowPath',
              filter: {
                isFilter: true,
                type: 'contains',
              },
            },
            {
              label: 'Top Contributor',
              valueField: 'topContributor',
              filter: {
                isFilter: true,
                type: 'contains',
              },
            },
            {
              label: 'Time(ms)',
              valueField: 'time',
              filter: {
                isFilter: true,
                type: 'contains',
              },
            },
            {
              label: 'Count',
              valueField: 'count',
              filter: {
                isFilter: true,
                type: 'contains',
              },
            },
          ],
        },
      ],
      data: [
        {
          pattern: 'Overall',
          avgTime: '251.32',
          flowPathcount: '25',
          percentageFlowPath: '100',
          topContributor: '-',
          time: '-',
          count: '-'
        },
        {
          pattern: 'Pattern1',
          avgTime: '205.133',
          flowPathcount: '15',
          percentageFlowPath: '60',
          topContributor: 'HttpServlet.service()',
          time: '2',
          count: '1'
        },
        
    ],
},
{
  paginator: {
    first: 1,
    rows: 33,
    rowsPerPageOptions: [3, 5, 10, 25, 50, 100],
  },
  label: 'Top Methods (Total Self time (ms) and count per flow path)',
  collapsed: true,
  searchOption: true,
  headers: [
      {
          "cols": [
            {
              "label": "Flowpath",
              "colspan": 2,
              "rowspan": null,
              filter: {
                isFilter: false,
              }
            },
            {
              "label": "OverAll",
              "colspan": 2,
              "rowspan": null,
              filter: {
                isFilter: false,
              }
            },
            {
              "label": "Pattern1",
              "colspan": 2,
              "rowspan": null,
              filter: {
                isFilter: false,
              }
            },
            {
              "label": "Pattern2",
              "colspan": 2,
              "rowspan": null,
              filter: {
                isFilter: false,
              }
            },
            {
              "label": "Pattern3",
              "colspan": 2,
              "rowspan": null,
              filter: {
                isFilter: false,
              }
            },
            {
              "label": "Pattern4",
              "colspan": 2,
              "rowspan": null,
              filter: {
                isFilter: false,
              }
            },
            {
              "label": "Pattern5",
              "colspan": 2,
              "rowspan": null,
              filter: {
                isFilter: false,
              }
            }
          ]
        },
    
        {
          "cols": [
            {
              "label": "Package",
              "rowspan": 2,
              "colspan": 1,
              "valueField": "package",
              filter: {
                isFilter: true,
                type: 'contains',
              },
            },
            {
              "label": "Method Name",
              "rowspan": 2,
              "colspan": 1,
              "valueField": "methodname",
              filter: {
                isFilter: true,
                type: 'contains',
              }
            },
            {
              "label": "Time(ms)",
              "colspan": null,
              "rowspan": null,
              "valueField": "field0",
              filter: {
                isFilter: true,
                type: 'contains',
              }
            },
            {
              "label": "Count",
              "colspan": null,
              "rowspan": null,
              "valueField": "field1",
              filter: {
                isFilter: true,
                type: 'contains',
              }
            },
            {
              "label": "Time(ms)",
              "colspan": null,
              "rowspan": null,
              "valueField": "field2",
              filter: {
                isFilter: true,
                type: 'contains',
              }
            },
            {
              "label": "Count",
              "colspan": null,
              "rowspan": null,
              "valueField": "field3",
              filter: {
                isFilter: true,
                type: 'contains',
              }
            },
            {
              "label": "Time(ms)",
              "colspan": null,
              "rowspan": null,
              "valueField": "field4",
              filter: {
                isFilter: true,
                type: 'contains',
              }
            },
            {
              "label": "Count",
              "colspan": null,
              "rowspan": null,
              "valueField": "field5",
              filter: {
                isFilter: true,
                type: 'contains',
              }
            },
            {
              "label": "Time(ms)",
              "colspan": null,
              "rowspan": null,
              "valueField": "field6",
              filter: {
                isFilter: true,
                type: 'contains',
              }
            },
            {
                "label": "Count",
                "colspan": null,
                "rowspan": null,
                "valueField": "field7",
                filter: {
                  isFilter: true,
                  type: 'contains',
                }
              },
              {
                "label": "Time(ms)",
                "colspan": null,
                "rowspan": null,
                "valueField": "field8",
                filter: {
                  isFilter: true,
                  type: 'contains',
                }
              },
              {
                "label": "Count",
                "colspan": null,
                "rowspan": null,
                "valueField": "field9",
                filter: {
                  isFilter: true,
                  type: 'contains',
                }
              },
              {
                "label": "Time(ms)",
                "colspan": null,
                "rowspan": null,
                "valueField": "field10",
                filter: {
                  isFilter: true,
                  type: 'contains',
                }
              },
              {
                "label": "Count",
                "colspan": null,
                "rowspan": null,
                "valueField": "field11",
                filter: {
                  isFilter: true,
                  type: 'contains',
                }
              },
                  
          ]
        }
      ],
      data:[
          {
              "package": "abc",
              "methodname": "HttpServlet.service()",
              "field0": "200",
              "field1": "0",
              "field2": "200",
              "field3": "0",
              "field4": "200",
              "field5": "0",
              "field6": "200",
              "field7": "0",
              "field8": "200",
              "field9": "0",
              "field10": "200",
              "field11": "0"  
            },
      ]
      }
  ]
}