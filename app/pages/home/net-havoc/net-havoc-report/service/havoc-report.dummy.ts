import { HavocReportData } from './havoc-report.model';

export const NET_HAVOC_REPORT_TABLE: HavocReportData = {
  havocReportTable: {
    paginator: {
      first: 0,
      rows: 15,
      rowsPerPageOptions: [15, 20, 25, 50, 100],
    },
    headers: [
      {
        cols: [
          {
            label: 'Methods',
            valueField: 'methods',
            classes: 'text-left',
            severityColorField: true,
            filter: {
              isFilter: true,
              type: 'contains',
            },
            isSort: true,
            selected: true
          },
          {
            label: 'Elapsed Time',
            valueField: 'elapsedTime',
            classes: 'text-left',
            filter: {
              isFilter: true,
              type: 'contains',
            },
            isSort: true,
            selected: true
          },
          {
            label: 'Wall Time',
            valueField: 'wallTime',
            classes: 'text-left',
            filter: {
              isFilter: true,
              type: 'contains',
            },
            isSort: true,
            selected: true
          },
          {
            label: 'Percentage',
            valueField: 'percentage',
            classes: 'text-left',
            filter: {
              isFilter: true,
              type: 'contains',
            },
            isSort: true,
            selected: true
          },
          {
            label: 'CPU Time',
            valueField: 'cpu',
            classes: 'text-left',
            filter: {
              isFilter: true,
              type: 'contains',
            },
            isSort: true,
            selected: true
          },
          {
            label: 'Thread Queue',
            valueField: 'threadQueue',
            classes: 'text-left',
            filter: {
              isFilter: true,
              type: 'contains',
            },
            isSort: true,
            selected: true
          },
          {
            label: 'Self Time',
            valueField: 'selfTime',
            classes: 'text-left',
            filter: {
              isFilter: true,
              type: 'contains',
            },
            isSort: true,
            selected: true
          },
          {
            label: 'Thread ID',
            valueField: 'threadId',
            classes: 'text-left',
            filter: {
              isFilter: true,
              type: 'contains',
            },
            isSort: true,
            selected: true
          },
          {
            label: 'Thread',
            valueField: 'thread',
            classes: 'text-left',
            filter: {
              isFilter: true,
              type: 'contains',
            },
            isSort: true,
            selected: true
          },
          {
            label: 'Arguments',
            valueField: 'arguments',
            classes: 'text-left',
            filter: {
              isFilter: true,
              type: 'contains',
            },
            isSort: true,
            selected: true
          },        
        ],
      },
    ],

    data: [
      {
        data: {
          methods: 'CC-W-CA-Fremont-HE1',
          elapsedTime: '76',
          wallTime: '0',
          percentage: '3.241%',
          cpu: '0',
          threadQueue: '2589.191',
          selfTime: '2589.191',
          threadId: '1',
          thread: '1',
          arguments: '4',
          
        },
        children: [
          {
            data: {
              methods: 'CC-W-CA-Fremont-HE1',
              elapsedTime: '76',
              wallTime: '0',
              percentage: '3.241%',
              cpu: '0',
              threadQueue: '2589.191',
              selfTime: '2589.191',
              threadId: '1',
              thread: '1',
              arguments: '4',
              
            },
            children: [
              {
                data: {
                  methods: 'CC-W-CA-Fremont-HE1',
                  elapsedTime: '76',
                  wallTime: '0',
                  percentage: '3.241%',
                  cpu: '0',
                  threadQueue: '2589.191',
                  selfTime: '2589.191',
                  threadId: '1',
                  thread: '1',
                  arguments: '4',
                  
                },
                children: [
                  {
                    data: {
                      methods: 'CC-W-CA-Fremont-HE1',
                      elapsedTime: '72',
                      wallTime: '0',
                      percentage: '3.241%',
                      cpu: '0',
                      threadQueue: '2589.191',
                      selfTime: '2589.191',
                      threadId: '1',
                      thread: '1',
                      arguments: '4',
                      
                    },
                  },
                ],
              },
            ],
          },
          {
            data: {
              methods: 'CC-W-CA-Fremont-HE1',
              elapsedTime: '76',
              wallTime: '0',
              percentage: '3.241%',
              cpu: '0',
              threadQueue: '2589.191',
              selfTime: '2589.191',
              threadId: '1',
              thread: '1',
              arguments: '4',
              
            },
          },
          {
            data: {
              methods: 'CC-W-CA-Fremont-HE5',
              elapsedTime: '76',
              wallTime: '0',
              percentage: '3.241%',
              cpu: '0',
              threadQueue: '2589.191',
              selfTime: '2589.191',
              threadId: '1',
              thread: '1',
              arguments: '4',
              
            },
          },
        ],
      },
      {
        data: {
          methods: 'CC-W-CA-Fremont-HE2',
          elapsedTime: '76',
          wallTime: '0',
          percentage: '3.241%',
          cpu: '0',
          threadQueue: '2589.191',
          selfTime: '2589.191',
          threadId: '1',
          thread: '1',
          arguments: '4',
          
          severityBgColorField: '#FF6B6B',
        },
        children: [
          {
            data: {
              methods: 'CC-W-CA-Fremont-HE1',
              elapsedTime: '76',
              wallTime: '0',
              percentage: '3.241%',
              cpu: '0',
              threadQueue: '2589.191',
              selfTime: '2589.191',
              threadId: '1',
              thread: '1',
              arguments: '4',
              
            },
          },
          {
            data: {
              methods: 'CC-W-CA-Fremont-HE1',
              elapsedTime: '76',
              wallTime: '0',
              percentage: '3.241%',
              cpu: '0',
              threadQueue: '2589.191',
              selfTime: '2589.191',
              threadId: '1',
              thread: '1',
              arguments: '4',
              
            },
          },
        ],
      },
      {
        data: {
          methods: 'CC-W-CA-Fremont-HE1',
          elapsedTime: '76',
          wallTime: '3',
          percentage: '3.241%',
          cpu: '0',
          threadQueue: '2589.191',
          selfTime: '2589.191',
          threadId: '1',
          thread: '1',
          arguments: '4',
          
          severityBgColorField: '#70D6C9',
        },
        children: [
          {
            data: {
              methods: 'CC-W-CA-Fremont-HE1',
              elapsedTime: '76',
              wallTime: '0',
              percentage: '3.241%',
              cpu: '0',
              threadQueue: '2589.191',
              selfTime: '2589.191',
              threadId: '1',
              thread: '1',
              arguments: '4',
              
            },
          },
          {
            data: {
              methods: 'CC-W-CA-Fremont-HE1',
              elapsedTime: '76',
              wallTime: '0',
              percentage: '3.241%',
              cpu: '0',
              threadQueue: '2589.191',
              selfTime: '2589.191',
              threadId: '1',
              thread: '1',
              arguments: '4',
              
            },
          },
        ],
      },
      {
        data: {
          methods: 'CC-W-CA-Fremont-HE1',
          elapsedTime: '76',
          wallTime: '0',
          percentage: '3.241%',
          cpu: '0',
          threadQueue: '2589.191',
          selfTime: '2589.191',
          threadId: '1',
          thread: '1',
          arguments: '4',
          
          severityBgColorField: '#B7EF80',
        },
        children: [
          {
            data: {
              methods: 'CC-W-CA-Fremont-HE1',
              elapsedTime: '76',
              wallTime: '0',
              percentage: '3.241%',
              cpu: '0',
              threadQueue: '2589.191',
              selfTime: '2589.191',
              threadId: '1',
              thread: '1',
              arguments: '4',
              
            },
            children: [
              {
                data: {
                  methods: 'CC-W-CA-Fremont-HE1',
                  elapsedTime: '76',
                  wallTime: '0',
                  percentage: '3.241%',
                  cpu: '0',
                  threadQueue: '2589.191',
                  selfTime: '2589.191',
                  threadId: '1',
                  thread: '1',
                  arguments: '4',
                  
                },
              },
              {
                data: {
                  methods: 'CC-W-CA-Fremont-HE1',
                  elapsedTime: '76',
                  wallTime: '0',
                  percentage: '3.241%',
                  cpu: '0',
                  threadQueue: '2589.191',
                  selfTime: '2589.191',
                  threadId: '1',
                  thread: '1',
                  arguments: '4',
                  
                },
              },
            ],
          },
          {
            data: {
              methods: 'CC-W-CA-Fremont-HE1',
              elapsedTime: '76',
              wallTime: '0',
              percentage: '3.241%',
              cpu: '0',
              threadQueue: '2589.191',
              selfTime: '2589.191',
              threadId: '1',
              thread: '1',
              arguments: '4',
              
            },
            children: [
              {
                data: {
                  methods: 'CC-W-CA-Fremont-HE1',
                  elapsedTime: '76',
                  wallTime: '0',
                  percentage: '3.241%',
                  cpu: '0',
                  threadQueue: '2589.191',
                  selfTime: '2589.191',
                  threadId: '1',
                  thread: '1',
                  arguments: '4',
                  
                },
              },
            ],
          },
        ],
      },
      {
        data: {
          methods: 'CC-W-CA-Fremont-HE1',
          elapsedTime: '76',
          wallTime: '0',
          percentage: '3.241%',
          cpu: '0',
          threadQueue: '2589.191',
          selfTime: '2589.191',
          threadId: '1',
          thread: '1',
          arguments: '4',
          
          severityBgColorField: '#D7D7D7',
        },
        children: [
          {
            data: {
              methods: 'CC-W-CA-Fremont-HE1',
              elapsedTime: '76',
              wallTime: '0',
              percentage: '3.241%',
              cpu: '0',
              threadQueue: '2589.191',
              selfTime: '2589.191',
              threadId: '1',
              thread: '1',
              arguments: '4',
              
            },
          },
          {
            data: {
              methods: 'CC-W-CA-Fremont-HE1',
              elapsedTime: '76',
              wallTime: '0',
              percentage: '3.241%',
              cpu: '0',
              threadQueue: '2589.191',
              selfTime: '2589.191',
              threadId: '1',
              thread: '1',
              arguments: '4',
              
            },
          },
        ],
      },
      {
        data: {
          methods: 'CC-W-CA-Fremont-HE1',
          elapsedTime: '76',
          wallTime: '0',
          percentage: '3.241%',
          cpu: '0',
          threadQueue: '2589.191',
          selfTime: '2589.191',
          threadId: '1',
          thread: '1',
          arguments: '4',
          
          severityBgColorField: '#5F5F5F',
        },
        children: [
          {
            data: {
              methods: 'CC-W-CA-Fremont-HE1',
              elapsedTime: '76',
              wallTime: '0',
              percentage: '3.241%',
              cpu: '0',
              threadQueue: '2589.191',
              selfTime: '2589.191',
              threadId: '1',
              thread: '1',
              arguments: '4',
              
            },
          },
          {
            data: {
              methods: 'CC-W-CA-Fremont-HE1',
              elapsedTime: '76',
              wallTime: '0',
              percentage: '3.241%',
              cpu: '0',
              threadQueue: '2589.191',
              selfTime: '2589.191',
              threadId: '1',
              thread: '1',
              arguments: '4',
              
            },
          },
          {
            data: {
              methods: 'CC-W-CA-Fremont-HE1',
              elapsedTime: '76',
              wallTime: '0',
              percentage: '3.241%',
              cpu: '0',
              threadQueue: '2589.191',
              selfTime: '2589.191',
              threadId: '1',
              thread: '1',
              arguments: '4',
              
            },
          },
        ],
      },
      {
        data: {
          methods: 'CC-W-CA-Fremont-HE1',
          elapsedTime: '76',
          wallTime: '0',
          percentage: '3.241%',
          cpu: '0',
          threadQueue: '2589.191',
          selfTime: '2589.191',
          threadId: '1',
          thread: '1',
          arguments: '4',
          
        },
        children: [
          {
            data: {
              methods: 'CC-W-CA-Fremont-HE1',
              elapsedTime: '76',
              wallTime: '0',
              percentage: '3.241%',
              cpu: '0',
              threadQueue: '2589.191',
              selfTime: '2589.191',
              threadId: '1',
              thread: '1',
              arguments: '4',
              
            },
          },
          {
            data: {
              methods: 'CC-W-CA-Fremont-HE1',
              elapsedTime: '76',
              wallTime: '0',
              percentage: '3.241%',
              cpu: '0',
              threadQueue: '2589.191',
              selfTime: '2589.191',
              threadId: '1',
              thread: '1',
              arguments: '4',
              
            },
          },
        ],
      },
      {
        data: {
          methods: 'CC-W-CA-Fremont-HE1',
          elapsedTime: '72',
          wallTime: '0',
          percentage: '3.241%',
          cpu: '0',
          threadQueue: '2589.191',
          selfTime: '2589.191',
          threadId: '1',
          thread: '1',
          arguments: '4',
          
        },
        children: [
          {
            data: {
              methods: 'CC-W-CA-Fremont-HE1',
              elapsedTime: '76',
              wallTime: '0',
              percentage: '3.241%',
              cpu: '0',
              threadQueue: '2589.191',
              selfTime: '2589.191',
              threadId: '1',
              thread: '1',
              arguments: '4',
              
            },
          },
          {
            data: {
              methods: 'CC-W-CA-Fremont-HE1',
              elapsedTime: '76',
              wallTime: '0',
              percentage: '3.241%',
              cpu: '0',
              threadQueue: '2589.191',
              selfTime: '2589.191',
              threadId: '1',
              thread: '1',
              arguments: '4',
              
            },
          },
          {
            data: {
              methods: 'CC-W-CA-Fremont-HE1',
              elapsedTime: '76',
              wallTime: '0',
              percentage: '3.241%',
              cpu: '0',
              threadQueue: '2589.191',
              selfTime: '2589.191',
              threadId: '1',
              thread: '1',
              arguments: '4',
              
            },
          },
        ],
      },
      {
        data: {
          methods: 'CC-W-CA-Fremont-HE1',
          elapsedTime: '76',
          wallTime: '0',
          percentage: '3.241%',
          cpu: '0',
          threadQueue: '2589.191',
          selfTime: '2589.191',
          threadId: '1',
          thread: '1',
          arguments: '4',
          
        },
        children: [
          {
            data: {
              methods: 'CC-W-CA-Fremont-HE1',
              elapsedTime: '76',
              wallTime: '0',
              percentage: '3.241%',
              cpu: '0',
              threadQueue: '2589.191',
              selfTime: '2589.191',
              threadId: '1',
              thread: '1',
              arguments: '4',
              
            },
          },
          {
            data: {
              methods: 'CC-W-CA-Fremont-HE1',
              elapsedTime: '76',
              wallTime: '0',
              percentage: '3.241%',
              cpu: '0',
              threadQueue: '2589.191',
              selfTime: '2589.191',
              threadId: '1',
              thread: '1',
              arguments: '4',
              
            },
          },
        ],
      },
      {
        data: {
          methods: 'CC-W-CA-Fremont-HE1',
          elapsedTime: '76',
          wallTime: '0',
          percentage: '3.241%',
          cpu: '0',
          threadQueue: '2589.191',
          selfTime: '2589.191',
          threadId: '1',
          thread: '1',
          arguments: '4',
          
        },
        children: [
          {
            data: {
              methods: 'CC-W-CA-Fremont-HE1',
              elapsedTime: '76',
              wallTime: '0',
              percentage: '3.241%',
              cpu: '0',
              threadQueue: '2589.191',
              selfTime: '2589.191',
              threadId: '1',
              thread: '1',
              arguments: '4',
              
            },
          },
          {
            data: {
              methods: 'CC-W-CA-Fremont-HE1',
              elapsedTime: '76',
              wallTime: '0',
              percentage: '3.241%',
              cpu: '0',
              threadQueue: '2589.191',
              selfTime: '2589.191',
              threadId: '1',
              thread: '1',
              arguments: '4',
              
            },
          },
        ],
      },
      {
        data: {
          methods: 'CC-W-CA-Fremont-HE1',
          elapsedTime: '76',
          wallTime: '0',
          percentage: '3.241%',
          cpu: '0',
          threadQueue: '2589.191',
          selfTime: '2589.191',
          threadId: '1',
          thread: '1',
          arguments: '4',
          
        },
        children: [
          {
            data: {
              methods: 'CC-W-CA-Fremont-HE1',
              elapsedTime: '76',
              wallTime: '0',
              percentage: '3.241%',
              cpu: '0',
              threadQueue: '2589.191',
              selfTime: '2589.191',
              threadId: '1',
              thread: '1',
              arguments: '4',
              
            },
          },
          {
            data: {
              methods: 'CC-W-CA-Fremont-HE1',
              elapsedTime: '76',
              wallTime: '0',
              percentage: '3.241%',
              cpu: '0',
              threadQueue: '2589.191',
              selfTime: '2589.191',
              threadId: '1',
              thread: '1',
              arguments: '4',
              
            },
          },
        ],
      },
      {
        data: {
          methods: 'CC-W-CA-Fremont-HE1',
          elapsedTime: '76',
          wallTime: '0',
          percentage: '3.241%',
          cpu: '0',
          threadQueue: '2589.191',
          selfTime: '2589.191',
          threadId: '1',
          thread: '1',
          arguments: '4',
          
        },
        children: [
          {
            data: {
              methods: 'CC-W-CA-Fremont-HE1',
              elapsedTime: '76',
              wallTime: '0',
              percentage: '3.241%',
              cpu: '0',
              threadQueue: '2589.191',
              selfTime: '2589.191',
              threadId: '1',
              thread: '1',
              arguments: '4',
              
            },
          },
          {
            data: {
              methods: 'CC-W-CA-Fremont-HE1',
              elapsedTime: '76',
              wallTime: '0',
              percentage: '3.241%',
              cpu: '0',
              threadQueue: '2589.191',
              selfTime: '2589.191',
              threadId: '1',
              thread: '1',
              arguments: '4',
              
            },
          },
        ],
      },
    ],
  },
  options: [
    {
      label: 'Linux',
      value: 'Linux',
    },
    {
      label: 'Docker',
      value: 'Docker',
    },
    {
      label: 'Kubernets',
      value: 'Kubernets',
    },
    {
      label: 'Windows',
      value: 'Windows',
    },
  ],
  havocStateCharts: [
    {
      title: 'Havoc Distribution',
      highchart: {
        chart: {
          height: '200px',
        },
        title: {
          text: null,
        },
        credits:{
          enabled:false
        },
        legend: {
          enabled: true,
          align: 'right',
          verticalAlign: 'middle',
          x: 0,
          y: 0,
          layout: 'vertical',
          itemStyle: {
            width: 70,
            color: '#333333',
            fontFamily: 'Product Sans',
            fontSize: '11px',
          },
        },
        xAxis: {
          allowDecimals: false,
          accessibility: {
            rangeDescription: 'Range: 1940 to 2017.',
          },
        },
        yAxis: {
          title: {
            text: null,
          },
        },
        tooltip: {
          pointFormat:
            '{series.name} had stockpiled <b>{point.y:,.0f}</b><br/>warheads in {point.x}',
        },
        plotOptions: {
          series: {
            pointStart: 1940,
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
          {
            name: 'USA',
            type: 'column',
            data: [
              6,
              11,
              32,
              110,
              235,
              369,
              640,
              1005,
              1436,
              2063,
              3057,
              4618,
              6444,
              9822,
            ],
          },
        ] as Highcharts.SeriesOptionsType[],
      },
    },
  ],
  havocDistributionCharts: [
    {
      title: 'Havoc Distribution',
      highchart: {
        chart: {
          type: 'pie',
          height:'190px'
        },
        credits:{
          enabled:false
        },
        title: {
          text: '375',
          align: 'center',
          verticalAlign: 'middle',
          y: 20,
          x: -80
        },
       
        yAxis: {
          title: {
            text: 'Total percent market share'
          }
        },
        plotOptions: {
          pie: {
            shadow: false,
            borderColor: null
          }
        },
        tooltip: {
          formatter: function() {
            return '<b>' + this.point.name + '</b>: ' + this.y + ' %';
          }
        },
        legend: {
          align: 'right',
          layout: 'vertical',
          verticalAlign: 'middle',
          symbolRadius: 0,
          symbolPadding: 10,
          itemMarginTop: 10,
          itemStyle: {
            "color": "#000",
            "fontSize": '12px'
          }
        },
        series: [{
          name: 'Browsers',
          data: [{
              y: 8,
              name: "Starve Application",
              color: "#4A4292"
            }, {
              y: 4,
              name: "State Change",
              color: "#F89B23"
            }, {
              y: 1,
              name: "Network Assults",
              color: "#16A9BD"
            }],
          size: '70%',
          innerSize: '70%',
          showInLegend: true,
          dataLabels: {
            enabled: false
          },
          marker: {
            symbol: 'square',
            radius: 12
          }
        }] as Highcharts.SeriesOptionsType[],
      },
    },
  ],
};
