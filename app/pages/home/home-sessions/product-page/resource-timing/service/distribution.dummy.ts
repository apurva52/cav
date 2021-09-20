import { ResourceTimingTable, VisualChart, resourceTimingData } from './distribution.model';

export const DISTRIBUTION_CHART_DATA: VisualChart = {
  hostStatisticsCharts: [
    {
      title: 'Host Statistics',
      highchart: {
        chart: {
          height: '200px',
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: false,
          type: 'pie'
        },
        credits: {
          enabled: false
        },
        title: {
          text: null,
        },
        legend: {
          enabled: true,
          // align: 'left',
          // verticalAlign: 'bottom',
          // x: 0,
          // y: 0,
          // layout: 'vertical',
          // itemStyle: {
          //   width: 70,
          //   color: '#333333',
          //   fontFamily: 'Product Sans',
          //   fontSize: '11px',
          // },
        },
        xAxis: {
          visible: false,
        },
        yAxis: {
          visible: false,
        },
        tooltip: {
          pointFormat:
            '{series.data.name} <b>{point.percentage:.1f}%</b>',
        },
        plotOptions: {
          series: {
            pointStart: 1940,
            stacking: 'normal',
            marker: {
              enabled: false,
            },
          },
        },
        series: [{

          colorByPoint: true,
          data: [{
            name: '71.21.4.10',
            y: 86.64,
            sliced: true,
            selected: true
          }, {
            name: '19.3.0.5',
            y: 2.69
          }, {
            name: '36.0.21.9',
            y: 2.58
          }, {
            name: '35.5.0.6',
            y: 2.56
          }, {
            name: '90.3.8.1',
            y: 2.56
          }, {
            name: '10.7.0.59',
            y: 2.37
          }, {
            name: '10.20.0.61:7013',
            y: 0.78
          }]
        }] as Highcharts.SeriesOptionsType[],
      },
    },
  ],
  contentStatisticsCharts: [
    {
      title: 'Content Type Statistics',
      highchart: {
        chart: {

          height: '200px',
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: false,
          type: 'pie'
        },
        credits: {
          enabled: false
        },
        title: {
          text: null,
        },
        legend: {
          enabled: true,
        },
        xAxis: {
          visible: false,
        },
        yAxis: {
          visible: false,
        },
        tooltip: {
          pointFormat:
            '{series.name}<b>{point.percentage:.1f}%</b> ',
        },
        plotOptions: {
          series: {
            pointStart: 1940,
            stacking: 'normal',
            marker: {
              enabled: false,
            },
          },
        },
        series: [{

          colorByPoint: true,
          data: [{
            name: '71.21.4.10',
            y: 86.64,
            sliced: true,
            selected: true
          }, {
            name: '19.3.0.5',
            y: 2.69
          }, {
            name: '36.0.21.9',
            y: 2.58
          }, {
            name: '35.5.0.6',
            y: 2.56
          }, {
            name: '90.3.8.1',
            y: 2.56
          }, {
            name: '10.7.0.59',
            y: 2.37
          }, {
            name: '10.20.0.61:7013',
            y: 0.78
          }]
        }] as Highcharts.SeriesOptionsType[],
      },
    },
  ],
  domainActivityCharts: [
    {
      title: 'Resource Timing',
      highchart: {
        chart: {
          height: '550px',
        },
        credits: {
          enabled: false
        },
        title: {
          text: null,
        },
        legend: {
          enabled: true,
        },
        xAxis: {
          categories: [
            'Base URL',
            'Api-bd.kohls.com',
            'Pran.cavisson.com',
            'widget.stylists.com',
            'content.stylists.com',
          ],
        },
        yAxis: {
          title: {
            text: null,
          },
          labels: {
            enabled: false,
          },
        },
        tooltip: {
          pointFormat:
            '{series.name} had stockpiled <b>{point.y:,.0f}</b><br/>warheads in {point.x}',
        },
        plotOptions: {
          series: {
            stacking: 'normal',
            marker: {
              enabled: false,
            },
          },
        },
        series: [
          {
            name: 'USA',
            type: 'bar',
            data: [6, 20, 45, 54, 23],
          },
          {
            name: 'USSR/Russia',
            type: 'bar',
            data: [5, 23, 32, 67, 32],
          },
          {
            name: 'India',
            type: 'bar',
            data: [11, 3, 34, 73, 23],
          },
          {
            name: 'France',
            type: 'bar',
            data: [6, 23, 54, 45, 34],
          },
          {
            name: 'UK',
            type: 'bar',
            data: [4, 12, 53, 48, 51],
          },
        ] as Highcharts.SeriesOptionsType[],
      },
    },
  ],
  bottleneckCharts: [
    {
      title: '',
      highchart: {
        chart: {
          height: '50px',
        },
        credits: {
          enabled: false
        },
        title: {
          text: null,
        },
        legend: {
          enabled: false,
        },
        xAxis: {
          visible: false,
        },
        yAxis: {
          visible: false,
        },
        tooltip: {
          pointFormat:
            '{series.name} had stockpiled <b>{point.y:,.0f}</b><br/>warheads in {point.x}',
        },
        plotOptions: {
          series: {
            stacking: 'normal',
            marker: {
              enabled: false,
            },
          },
        },
        series: [
          {
            name: 'USA',
            type: 'bar',
            data: [6],
          },
          {
            name: 'USA/US',
            type: 'bar',
            data: [6],
          },

        ] as Highcharts.SeriesOptionsType[],
      },
    },
  ],
};

export const DISTRIBUTION_TABLE_DATA: ResourceTimingTable = {
  hostStatisticsTable: {
    paginator: {
      first: 1,
      rows: 10,
      rowsPerPageOptions: [10, 20, 30, 50, 100],
    },

    headers: [
      {
        cols: [
          {
            label: 'Host',
            valueField: 'hostName',
            classes: 'text-right',
            selected: true,
            filter: {
              isFilter: true,
              type: 'contains',
            },
            isSort: true,
          },
          {
            label: '#Request',
            valueField: 'hostRequest',
            classes: 'text-right',
            selected: true,
            filter: {
              isFilter: true,
              type: 'contains',
            },
            isSort: true,
          },
          {
            label: '%Request',
            valueField: 'hostRequestPct',
            classes: 'text-right',
            selected: true,
            filter: {
              isFilter: true,
              type: 'contains',
            },
            isSort: true,
          },
          {
            label: 'Avg Response(ms)',
            valueField: 'hostAvgResponse',
            classes: 'text-right',
            selected: true,
            filter: {
              isFilter: true,
              type: 'contains',
            },
            isSort: true,
            width: '20%',
          },
          {
            label: '%Load Duration',
            valueField: 'hostLoadDuration',
            classes: 'text-right',
            selected: true,
            filter: {
              isFilter: true,
              type: 'contains',
            },
            isSort: true,
          },
        ],
      },
    ],
    data: [
      {
        "hostName": "10.20.0.61:7013",
        "hostRequest": 1,
        "hostRequestPct": 14.29,
        "hostAvgResponse": 37,
        "hostLoadDuration": 0.78
      },
      {
        "hostName": "10.7.0.59",
        "hostRequest": 1,
        "hostRequestPct": 14.29,
        "hostAvgResponse": 113,
        "hostLoadDuration": 2.37
      },
      {
        "hostName": "19.3.0.5",
        "hostRequest": 1,
        "hostRequestPct": 14.29,
        "hostAvgResponse": 128,
        "hostLoadDuration": 2.69
      },
      {
        "hostName": "35.5.0.6",
        "hostRequest": 1,
        "hostRequestPct": 14.29,
        "hostAvgResponse": 122,
        "hostLoadDuration": 2.56
      },
      {
        "hostName": "36.0.21.9",
        "hostRequest": 1,
        "hostRequestPct": 14.29,
        "hostAvgResponse": 123,
        "hostLoadDuration": 2.58
      },
      {
        "hostName": "71.21.4.10",
        "hostRequest": 1,
        "hostRequestPct": 14.29,
        "hostAvgResponse": 4120,
        "hostLoadDuration": 86.46
      },
      {
        "hostName": "90.3.8.1",
        "hostRequest": 1,
        "hostRequestPct": 14.29,
        "hostAvgResponse": 122,
        "hostLoadDuration": 2.56
      }
    ]
  },

  contentStatisticsTable: {
    paginator: {
      first: 1,
      rows: 10,
      rowsPerPageOptions: [10, 20, 30, 50, 100],
    },

    headers: [
      {
        cols: [
          {
            label: 'Content Type',
            valueField: 'ContentType',
            classes: 'text-left',
            selected: true,
            filter: {
              isFilter: true,
              type: 'contains',
            },
            isSort: true,
          },
          {
            label: '#Request',
            valueField: 'Request',
            classes: 'text-right',
            selected: true,
            filter: {
              isFilter: true,
              type: 'contains',
            },
            isSort: true,
          },
          {
            label: '%Request',
            valueField: 'RequestPct',
            classes: 'text-right',
            selected: true,
            filter: {
              isFilter: true,
              type: 'contains',
            },
            isSort: true,
          },
          {
            label: 'Avg Response(ms)',
            valueField: 'AvgResponse',
            classes: 'text-right',
            selected: true,
            filter: {
              isFilter: true,
              type: 'contains',
            },
            isSort: true,
            width: '20%',
          },
          {
            label: '%Load Duration',
            valueField: 'LoadDuration',
            classes: 'text-right',
            selected: true,
            filter: {
              isFilter: true,
              type: 'contains',
            },
            isSort: true,
          },
        ],
      },
    ],
    data: [
      {
        "ContentType": "HTML",
        "Request": 1,
        "RequestPct": 14.29,
        "AvgResponse": 37,
        "LoadDuration": 0.78
      },
      {
        "ContentType": "Images",
        "Request": 4,
        "RequestPct": 57.14,
        "AvgResponse": 1121.75,
        "LoadDuration": 94.17
      },
      {
        "ContentType": "Scripts",
        "Request": 2,
        "RequestPct": 28.57,
        "AvgResponse": 120.5,
        "LoadDuration": 5.06
      },
      {
        "ContentType": "Scripts",
        "Request": 2,
        "RequestPct": 28.57,
        "AvgResponse": 120.5,
        "LoadDuration": 5.06
      },
      {
        "ContentType": "Scripts",
        "Request": 2,
        "RequestPct": 28.57,
        "AvgResponse": 120.5,
        "LoadDuration": 5.06
      }
    ],
  },

  bottleneckTable: {
    paginator: {
      first: 1,
      rows: 10,
      rowsPerPageOptions: [10, 20, 30, 50, 100],
    },

    headers: [
      {
        cols: [
          {
            label: 'Name',
            valueField: 'profileName',
            classes: 'text-left',
            selected: true,
            filter: {
              isFilter: true,
              type: 'contains',
            },
            isSort: true,
            iconField: true,
          },
        ],
      },
    ],
    data: [
      {
        profileName: 'Main.js',
        icon: 'icons8 icons8-futures',
      },
      {
        profileName: 'Node.js',
        icon: 'icons8 icons8-futures',

      },
      {
        profileName: 'Config.js',
        icon: 'icons8 icons8-futures',

      },
      {
        profileName: 'Backbone.js',
        icon: 'icons8 icons8-futures',

      },
      {
        profileName: 'Widget.js',
        icon: 'icons8 icons8-futures',
      },
    ],

  },
  iconsField: 'icon',

  DomainActivtyTable: {
    paginator: {
      first: 1,
      rows: 10,
      rowsPerPageOptions: [10, 20, 30, 50, 100],
    },
    headers: [
      {
        cols: [

          {
            label: 'Domain Name',
            valueField: 'domainName',
            classes: 'text-center',
            severityColorField: true,
            width: '7%',
            isSort: true,

          },
          {
            label: 'Total Request',
            valueField: 'totalerequsr',
            classes: 'text-right',
            width: '7%',
            isSort: true,

          },
          {
            label: 'Aug Duration',
            valueField: 'duration_avg',
            classes: 'text-center',
            width: '7%',
            isSort: true,
          },
          {
            label: 'Avg Download',
            valueField: 'download_avg',
            classes: 'text-center',
            width: '9%',
            isSort: true,
          },
          {
            label: 'Avg Wait',
            valueField: 'wait_avg',
            classes: 'text-center',
            width: '6%',
            isSort: true,
          },
          {
            label: 'Avg Redirect',
            valueField: 'redirection_avg',
            classes: 'text-center',
            width: '8%',
            isSort: true,
          },
          {
            label: 'AVG DNS',
            valueField: 'dns_avg',
            classes: 'text-center',
            width: '6%',
            isSort: true,
          },
          {
            label: 'Avg TCP',
            valueField: 'tcp_avg',

            classes: 'text-center',
            width: '6%',
            isSort: true,
          },
          {
            label: 'Avg App cache',
            valueField: 'appCache_avg',
            classes: 'text-center',
            width: '11%',
            isSort: true,
          },
          {
            label: 'Transfer Size',
            valueField: 'transferSize',
            classes: 'text-center',
            width: '9%',
            isSort: true,
          }





        ]
      }
    ],
    data: [

      {


        "transferSize": "234.51 KB",
        "domainName": "10.20.0.61:7013",
        "totalerequsr": 6,

        "duration_avg": 37,

        "wait_avg": 12,

        "download_avg": 6,

        "dns_avg": 0,

        "tcp_avg": 0,

        "redirection_avg": 0,

        "appCache_avg": 0,



      },
      {

        "transferSize": "234.51 KB",
        "domainName": "10.20.0.61:7013",


        "duration_avg": 37,

        "wait_avg": 12,

        "download_avg": 6,

        "dns_avg": 0,

        "tcp_avg": 0,

        "redirection_avg": 0,

        "appCache_avg": 0,



      }


    ]



  },
  Waterfall_table: {
    paginator: {
      first: 1,
      rows: 10,
      rowsPerPageOptions: [10, 25, 50, 100],
    },

    headers: [
      {
        cols: [
          {



            label: 'File Name',
            valueField: 'filename',
            classes: 'text-center',
            severityColorField: true,
            isSort: true,

          },
          {
            label: 'host',
            valueField: 'host',
            classes: 'text-right',
            isSort: true,

          },
          {
            label: 'Initialiser',
            valueField: 'initiatorType',
            classes: 'text-center',
            isSort: true,

          },
          {
            label: 'Strat Time',
            valueField: 'startTime',
            classes: 'text-center',
            isSort: true,

          },
          {
            label: 'Duration',
            valueField: 'duration',
            classes: 'text-center',
            isSort: true,

          },
          {
            label: 'Redirect Time',
            valueField: 'redirect',
            classes: 'text-center',
            isSort: true,

          },
          {
            label: 'DNS',
            valueField: 'dns',
            classes: 'text-center',
            isSort: true,

          },
          {
            label: 'appCacheTime',
            valueField: 'request',
            classes: 'text-center',
            isSort: true,

          },
          {
            label: 'TCP',
            valueField: 'tcp',
            classes: 'text-center',
            isSort: true,

          },
          {
            label: 'wait',
            valueField: 'phaseGap3start',
            classes: 'text-center',
            isSort: true,

          },
          {
            label: 'Download',
            valueField: 'phaseGap3',
            classes: 'text-center',
            isSort: true,

          },
          {
            label: 'Transfer Size',
            valueField: 'transferSize',
            classes: 'text-center',
            isSort: true,

          },
          {
            label: 'Protocol',
            valueField: 'requestStart',
            classes: 'text-center',
            isSort: true,

          },




        ]
      }
    ],
    data: [
      {

        "filename": "index.html",
        "host": "10.20.0.61:7013",
        "initiatorType": "text/html",
        "startTime": 0,
        "duration": 37,
        "transferSize": "234.51 KB",
        "redirect": 0,
        "dns": 0,
        "tcp": 0,
        "phaseGap3start": 13,
        "phaseGap3": 6,
        "requestStart": 19,
        "request": 12,

      },
      {

        "filename": "index.html",
        "host": "10.20.0.61:7013",
        "initiatorType": "text/html",
        "startTime": 0,
        "duration": 37,
        "transferSize": "234.51 KB",
        "redirect": 0,
        "dns": 0,
        "tcp": 0,
        "phaseGap3start": 13,
        "phaseGap3": 6,
        "requestStart": 19,
        "request": 12,

      }
    ]


  }


};

export const RESOURCE_TIMING_DATA = {
  "starttime": 0,
  "duration": 5594,
  "totalbytes": "3.89 MB",
  "bandwidth": "4.887 Mbps",
  "entries": [
    {
      "url": "https://10.20.0.65:8443/ProductUI/#/login",
      "filename": "ProductUI",
      "host": "10.20.0.65:8443",
      "nextHopProtocol": "http/1.1",
      "servertimearr": null,
      "tt": {
        "redirectStart": "+4ms",
        "redirect": "479ms",
        "cacheStart": "+483ms",
        "cache": "0ms",
        "dnsStart": "+483ms",
        "dns": "0ms",
        "tcpStart": "+483ms",
        "tcp": "0ms",
        "requestStart": "+486ms",
        "responseStart": "+583ms",
        "response": "1ms"
      },
      "initiatorType": "text/plain",
      "contentType": "Others",
      "startTime": 0,
      "start": "0ms",
      "duration": 584,
      "dur": "584ms",
      "differentOriginFlag": false,
      "failedResourceFlag": false,
      "transferSize": "12.22 KB",
      "rawtransfersize": 12516,
      "encodedBodySize": "10.58 KB",
      "decodedBodySize": "10.58 KB",
      "isCache": false,
      "isCompressed": false,
      "timing": {
        "redirectStart": 4,
        "redirect": 479,
        "phaseGap1start": 483,
        "phaseGap1": 0,
        "cacheStart": 483,
        "cache": 0,
        "dnsStart": 483,
        "dns": 0,
        "phaseGap2start": 483,
        "phaseGap2": 0,
        "tcpStart": 483,
        "tcp": 0,
        "phaseGap3start": 483,
        "phaseGap3": 3,
        "requestStart": 486,
        "request": 97,
        "responseStart": 583,
        "response": 1
      }
    },
    {
      "url": "https://10.20.0.65:8443/ProductUI/resources/netvision/css/bootstrap.min.3.4.1.css",
      "filename": "bootstrap.min.3.4.1.css",
      "host": "10.20.0.65:8443",
      "nextHopProtocol": "http/1.1",
      "servertimearr": null,
      "tt": {
        "redirectStart": "0ms",
        "redirect": "0ms",
        "cacheStart": "0ms",
        "cache": "0ms",
        "dnsStart": "0ms",
        "dns": "0ms",
        "tcpStart": "0ms",
        "tcp": "0ms",
        "requestStart": "+6ms",
        "responseStart": "+107ms",
        "response": "3ms"
      },
      "initiatorType": "text/css",
      "contentType": "Stylesheets",
      "startTime": 634,
      "start": "+634ms",
      "duration": 109,
      "dur": "109ms",
      "differentOriginFlag": false,
      "failedResourceFlag": false,
      "transferSize": "19.92 KB",
      "rawtransfersize": 20400,
      "encodedBodySize": "19.28 KB",
      "decodedBodySize": "118.62 KB",
      "isCache": false,
      "isCompressed": true,
      "timing": {
        "redirectStart": 634,
        "redirect": 0,
        "phaseGap1start": 634,
        "phaseGap1": 0,
        "cacheStart": 634,
        "cache": 0,
        "dnsStart": 634,
        "dns": 0,
        "phaseGap2start": 634,
        "phaseGap2": 0,
        "tcpStart": 634,
        "tcp": 0,
        "phaseGap3start": 634,
        "phaseGap3": 6,
        "requestStart": 640,
        "request": 101,
        "responseStart": 741,
        "response": 3
      }
    },
    {
      "url": "https://10.20.0.65:8443/ProductUI/resources/unified-icons/unified-icons.css",
      "filename": "unified-icons.css",
      "host": "10.20.0.65:8443",
      "nextHopProtocol": "http/1.1",
      "servertimearr": null,
      "tt": {
        "redirectStart": "0ms",
        "redirect": "0ms",
        "cacheStart": "0ms",
        "cache": "0ms",
        "dnsStart": "0ms",
        "dns": "0ms",
        "tcpStart": "0ms",
        "tcp": "0ms",
        "requestStart": "+8ms",
        "responseStart": "+101ms",
        "response": "90ms"
      },
      "initiatorType": "text/css",
      "contentType": "Stylesheets",
      "startTime": 636,
      "start": "+636ms",
      "duration": 191,
      "dur": "191ms",
      "differentOriginFlag": false,
      "failedResourceFlag": false,
      "transferSize": "32.54 KB",
      "rawtransfersize": 33322,
      "encodedBodySize": "32.23 KB",
      "decodedBodySize": "32.23 KB",
      "isCache": false,
      "isCompressed": false,
      "timing": {
        "redirectStart": 636,
        "redirect": 0,
        "phaseGap1start": 636,
        "phaseGap1": 0,
        "cacheStart": 636,
        "cache": 0,
        "dnsStart": 636,
        "dns": 0,
        "phaseGap2start": 636,
        "phaseGap2": 0,
        "tcpStart": 636,
        "tcp": 0,
        "phaseGap3start": 636,
        "phaseGap3": 8,
        "requestStart": 644,
        "request": 93,
        "responseStart": 737,
        "response": 90
      }
    },
    {
      "url": "https://10.20.0.65:8443/ProductUI/styles.87f92f4e6cbbc5053367.css",
      "filename": "styles.87f92f4e6cbbc5053367.css",
      "host": "10.20.0.65:8443",
      "nextHopProtocol": "http/1.1",
      "servertimearr": null,
      "tt": {
        "redirectStart": "0ms",
        "redirect": "0ms",
        "cacheStart": "0ms",
        "cache": "0ms",
        "dnsStart": "0ms",
        "dns": "0ms",
        "tcpStart": "0ms",
        "tcp": "0ms",
        "requestStart": "+105ms",
        "responseStart": "+196ms",
        "response": "465ms"
      },
      "initiatorType": "text/css",
      "contentType": "Stylesheets",
      "startTime": 640,
      "start": "+640ms",
      "duration": 661,
      "dur": "661ms",
      "differentOriginFlag": false,
      "failedResourceFlag": false,
      "transferSize": "278.29 KB",
      "rawtransfersize": 284969,
      "encodedBodySize": "274.14 KB",
      "decodedBodySize": "2.09 MB",
      "isCache": false,
      "isCompressed": false,
      "timing": {
        "redirectStart": 640,
        "redirect": 0,
        "phaseGap1start": 640,
        "phaseGap1": 0,
        "cacheStart": 640,
        "cache": 0,
        "dnsStart": 640,
        "dns": 0,
        "phaseGap2start": 640,
        "phaseGap2": 0,
        "tcpStart": 640,
        "tcp": 0,
        "phaseGap3start": 640,
        "phaseGap3": 105,
        "requestStart": 745,
        "request": 91,
        "responseStart": 836,
        "response": 465
      }
    },
    {
      "url": "https://10.20.0.65:8443/ProductUI/images/new_logo-o.png",
      "filename": "new_logo-o.png",
      "host": "10.20.0.65:8443",
      "nextHopProtocol": "http/1.1",
      "servertimearr": null,
      "tt": {
        "redirectStart": "0ms",
        "redirect": "0ms",
        "cacheStart": "0ms",
        "cache": "955ms",
        "dnsStart": "+955ms",
        "dns": "0ms",
        "tcpStart": "+955ms",
        "tcp": "379ms",
        "requestStart": "+1.33s",
        "responseStart": "+1.44s",
        "response": "282ms"
      },
      "initiatorType": "image/png",
      "contentType": "Images",
      "startTime": 644,
      "start": "+644ms",
      "duration": 1725,
      "dur": "1.73s",
      "differentOriginFlag": false,
      "failedResourceFlag": false,
      "transferSize": "69.73 KB",
      "rawtransfersize": 71399,
      "encodedBodySize": "69.41 KB",
      "decodedBodySize": "69.41 KB",
      "isCache": false,
      "isCompressed": false,
      "timing": {
        "redirectStart": 644,
        "redirect": 0,
        "phaseGap1start": 644,
        "phaseGap1": 0,
        "cacheStart": 644,
        "cache": 955,
        "dnsStart": 1599,
        "dns": 0,
        "phaseGap2start": 1599,
        "phaseGap2": 0,
        "tcpStart": 1599,
        "tcp": 379,
        "phaseGap3start": 1978,
        "phaseGap3": 0,
        "requestStart": 1978,
        "request": 109,
        "responseStart": 2087,
        "response": 282
      }
    },
    {
      "url": "https://10.20.0.65:8443/ProductUI/runtime.a8bbab97b14a864a1784.js",
      "filename": "runtime.a8bbab97b14a864a1784.js",
      "host": "10.20.0.65:8443",
      "nextHopProtocol": "http/1.1",
      "servertimearr": null,
      "tt": {
        "redirectStart": "0ms",
        "redirect": "0ms",
        "cacheStart": "0ms",
        "cache": "0ms",
        "dnsStart": "0ms",
        "dns": "0ms",
        "tcpStart": "0ms",
        "tcp": "0ms",
        "requestStart": "+190ms",
        "responseStart": "+274ms",
        "response": "1ms"
      },
      "initiatorType": "text/javascript",
      "contentType": "Scripts",
      "startTime": 644,
      "start": "+644ms",
      "duration": 274,
      "dur": "274ms",
      "differentOriginFlag": false,
      "failedResourceFlag": false,
      "transferSize": "7.07 KB",
      "rawtransfersize": 7244,
      "encodedBodySize": "6.75 KB",
      "decodedBodySize": "6.75 KB",
      "isCache": false,
      "isCompressed": false,
      "timing": {
        "redirectStart": 644,
        "redirect": 0,
        "phaseGap1start": 644,
        "phaseGap1": 0,
        "cacheStart": 644,
        "cache": 0,
        "dnsStart": 644,
        "dns": 0,
        "phaseGap2start": 644,
        "phaseGap2": 0,
        "tcpStart": 644,
        "tcp": 0,
        "phaseGap3start": 644,
        "phaseGap3": 190,
        "requestStart": 834,
        "request": 84,
        "responseStart": 918,
        "response": 1
      }
    },
    {
      "url": "https://10.20.0.65:8443/ProductUI/polyfills.72b5a3be2aa4fdef3477.js",
      "filename": "polyfills.72b5a3be2aa4fdef3477.js",
      "host": "10.20.0.65:8443",
      "nextHopProtocol": "http/1.1",
      "servertimearr": null,
      "tt": {
        "redirectStart": "0ms",
        "redirect": "0ms",
        "cacheStart": "0ms",
        "cache": "0ms",
        "dnsStart": "0ms",
        "dns": "0ms",
        "tcpStart": "0ms",
        "tcp": "0ms",
        "requestStart": "+277ms",
        "responseStart": "+372ms",
        "response": "122ms"
      },
      "initiatorType": "text/javascript",
      "contentType": "Scripts",
      "startTime": 645,
      "start": "+645ms",
      "duration": 494,
      "dur": "494ms",
      "differentOriginFlag": false,
      "failedResourceFlag": false,
      "transferSize": "91.86 KB",
      "rawtransfersize": 94063,
      "encodedBodySize": "91.53 KB",
      "decodedBodySize": "91.53 KB",
      "isCache": false,
      "isCompressed": false,
      "timing": {
        "redirectStart": 645,
        "redirect": 0,
        "phaseGap1start": 645,
        "phaseGap1": 0,
        "cacheStart": 645,
        "cache": 0,
        "dnsStart": 645,
        "dns": 0,
        "phaseGap2start": 645,
        "phaseGap2": 0,
        "tcpStart": 645,
        "tcp": 0,
        "phaseGap3start": 645,
        "phaseGap3": 277,
        "requestStart": 922,
        "request": 95,
        "responseStart": 1017,
        "response": 122
      }
    },
    {
      "url": "https://10.20.0.65:8443/ProductUI/scripts.675d3bf2da0635286b25.js",
      "filename": "scripts.675d3bf2da0635286b25.js",
      "host": "10.20.0.65:8443",
      "nextHopProtocol": "http/1.1",
      "servertimearr": null,
      "tt": {
        "redirectStart": "0ms",
        "redirect": "0ms",
        "cacheStart": "0ms",
        "cache": "0ms",
        "dnsStart": "0ms",
        "dns": "0ms",
        "tcpStart": "0ms",
        "tcp": "0ms",
        "requestStart": "+503ms",
        "responseStart": "+589ms",
        "response": "346ms"
      },
      "initiatorType": "text/javascript",
      "contentType": "Scripts",
      "startTime": 645,
      "start": "+645ms",
      "duration": 935,
      "dur": "935ms",
      "differentOriginFlag": false,
      "failedResourceFlag": false,
      "transferSize": "214.93 KB",
      "rawtransfersize": 220088,
      "encodedBodySize": "211.62 KB",
      "decodedBodySize": "690.24 KB",
      "isCache": false,
      "isCompressed": true,
      "timing": {
        "redirectStart": 645,
        "redirect": 0,
        "phaseGap1start": 645,
        "phaseGap1": 0,
        "cacheStart": 645,
        "cache": 0,
        "dnsStart": 645,
        "dns": 0,
        "phaseGap2start": 645,
        "phaseGap2": 0,
        "tcpStart": 645,
        "tcp": 0,
        "phaseGap3start": 645,
        "phaseGap3": 503,
        "requestStart": 1148,
        "request": 86,
        "responseStart": 1234,
        "response": 346
      }
    },
    {
      "url": "https://10.20.0.65:8443/ProductUI/vendor.cbb7e3b83ba16fa14ab1.js",
      "filename": "vendor.cbb7e3b83ba16fa14ab1.js",
      "host": "10.20.0.65:8443",
      "nextHopProtocol": "http/1.1",
      "servertimearr": null,
      "tt": {
        "redirectStart": "0ms",
        "redirect": "0ms",
        "cacheStart": "0ms",
        "cache": "0ms",
        "dnsStart": "0ms",
        "dns": "0ms",
        "tcpStart": "0ms",
        "tcp": "0ms",
        "requestStart": "+658ms",
        "responseStart": "+772ms",
        "response": "2.45s"
      },
      "initiatorType": "text/javascript",
      "contentType": "Scripts",
      "startTime": 645,
      "start": "+645ms",
      "duration": 3222,
      "dur": "3.22s",
      "differentOriginFlag": false,
      "failedResourceFlag": false,
      "transferSize": "1.45 MB",
      "rawtransfersize": 1516296,
      "encodedBodySize": "1.43 MB",
      "decodedBodySize": "6.73 MB",
      "isCache": false,
      "isCompressed": true,
      "timing": {
        "redirectStart": 645,
        "redirect": 0,
        "phaseGap1start": 645,
        "phaseGap1": 0,
        "cacheStart": 645,
        "cache": 0,
        "dnsStart": 645,
        "dns": 0,
        "phaseGap2start": 645,
        "phaseGap2": 0,
        "tcpStart": 645,
        "tcp": 0,
        "phaseGap3start": 645,
        "phaseGap3": 658,
        "requestStart": 1303,
        "request": 114,
        "responseStart": 1417,
        "response": 2451
      }
    },
    {
      "url": "https://10.20.0.65:8443/ProductUI/main.e9eda7136a72a72234e0.js",
      "filename": "main.e9eda7136a72a72234e0.js",
      "host": "10.20.0.65:8443",
      "nextHopProtocol": "http/1.1",
      "servertimearr": null,
      "tt": {
        "redirectStart": "0ms",
        "redirect": "0ms",
        "cacheStart": "0ms",
        "cache": "0ms",
        "dnsStart": "0ms",
        "dns": "0ms",
        "tcpStart": "0ms",
        "tcp": "0ms",
        "requestStart": "+935ms",
        "responseStart": "+1.04s",
        "response": "2.47s"
      },
      "initiatorType": "text/javascript",
      "contentType": "Scripts",
      "startTime": 646,
      "start": "+646ms",
      "duration": 3506,
      "dur": "3.51s",
      "differentOriginFlag": false,
      "failedResourceFlag": false,
      "transferSize": "1.51 MB",
      "rawtransfersize": 1587721,
      "encodedBodySize": "1.49 MB",
      "decodedBodySize": "10.61 MB",
      "isCache": false,
      "isCompressed": true,
      "timing": {
        "redirectStart": 646,
        "redirect": 0,
        "phaseGap1start": 646,
        "phaseGap1": 0,
        "cacheStart": 646,
        "cache": 0,
        "dnsStart": 646,
        "dns": 0,
        "phaseGap2start": 646,
        "phaseGap2": 0,
        "tcpStart": 646,
        "tcp": 0,
        "phaseGap3start": 646,
        "phaseGap3": 935,
        "requestStart": 1581,
        "request": 101,
        "responseStart": 1682,
        "response": 2470
      }
    },
    {
      "url": "https://10.20.0.65:8003/nv/kohls/nv_bootstrap.js",
      "filename": "nv_bootstrap.js",
      "host": "10.20.0.65:8003",
      "nextHopProtocol": "http/1.1",
      "servertimearr": null,
      "tt": {
        "contentload": "+4.15s",
        "onload": "+4.20s",
        "prt": "+4.15s"
      },
      "initiatorType": "text/javascript",
      "contentType": "Scripts",
      "startTime": 646,
      "start": "+646ms",
      "duration": 1445,
      "dur": "1.45s",
      "differentOriginFlag": true,
      "failedResourceFlag": false,
      "transferSize": "-",
      "rawtransfersize": 0,
      "encodedBodySize": "-",
      "decodedBodySize": "-",
      "isCache": false,
      "isCompressed": false,
      "timing": {
        "redirect": "-",
        "cache": "-",
        "dns": "-",
        "tcp": "-",
        "request": "-",
        "response": "-"
      }
    },
    {
      "url": "https://fonts.googleapis.com/css?family=Roboto:400,500",
      "filename": "css",
      "host": "fonts.googleapis.com",
      "nextHopProtocol": "h2",
      "servertimearr": null,
      "tt": {
        "redirectStart": "0ms",
        "redirect": "0ms",
        "cacheStart": "0ms",
        "cache": "0ms",
        "dnsStart": "0ms",
        "dns": "0ms",
        "tcpStart": "0ms",
        "tcp": "0ms",
        "requestStart": "+1ms",
        "responseStart": "+2ms",
        "response": "0ms"
      },
      "initiatorType": "text/plain",
      "contentType": "Others",
      "startTime": 1309,
      "start": "+1.31s",
      "duration": 2,
      "dur": "2ms",
      "differentOriginFlag": false,
      "failedResourceFlag": false,
      "transferSize": "-",
      "rawtransfersize": 0,
      "encodedBodySize": "0.58 KB",
      "decodedBodySize": "3.91 KB",
      "isCache": true,
      "isCompressed": true,
      "timing": {
        "redirectStart": 1309,
        "redirect": 0,
        "phaseGap1start": 1309,
        "phaseGap1": 0,
        "cacheStart": 1309,
        "cache": 0,
        "dnsStart": 1309,
        "dns": 0,
        "phaseGap2start": 1309,
        "phaseGap2": 0,
        "tcpStart": 1309,
        "tcp": 0,
        "phaseGap3start": 1309,
        "phaseGap3": 1,
        "requestStart": 1310,
        "request": 1,
        "responseStart": 1311,
        "response": 0
      }
    },
    {
      "url": "https://fonts.googleapis.com/icon?family=Material Icons",
      "filename": "icon",
      "host": "fonts.googleapis.com",
      "nextHopProtocol": "h2",
      "servertimearr": null,
      "tt": {
        "redirectStart": "0ms",
        "redirect": "0ms",
        "cacheStart": "0ms",
        "cache": "0ms",
        "dnsStart": "0ms",
        "dns": "0ms",
        "tcpStart": "0ms",
        "tcp": "0ms",
        "requestStart": "+1ms",
        "responseStart": "+2ms",
        "response": "2ms"
      },
      "initiatorType": "text/plain",
      "contentType": "Others",
      "startTime": 1310,
      "start": "+1.31s",
      "duration": 3,
      "dur": "3ms",
      "differentOriginFlag": false,
      "failedResourceFlag": false,
      "transferSize": "-",
      "rawtransfersize": 0,
      "encodedBodySize": "0.33 KB",
      "decodedBodySize": "0.55 KB",
      "isCache": true,
      "isCompressed": true,
      "timing": {
        "redirectStart": 1310,
        "redirect": 0,
        "phaseGap1start": 1310,
        "phaseGap1": 0,
        "cacheStart": 1310,
        "cache": 0,
        "dnsStart": 1310,
        "dns": 0,
        "phaseGap2start": 1310,
        "phaseGap2": 0,
        "tcpStart": 1310,
        "tcp": 0,
        "phaseGap3start": 1310,
        "phaseGap3": 1,
        "requestStart": 1311,
        "request": 1,
        "responseStart": 1312,
        "response": 2
      }
    },
    {
      "url": "https://10.20.0.65:8443/ProductUI/#NVURL",
      "filename": "ProductUI",
      "host": "10.20.0.65:8443",
      "nextHopProtocol": "http/1.1",
      "servertimearr": null,
      "tt": {
        "redirectStart": "0ms",
        "redirect": "709ms",
        "cacheStart": "+711ms",
        "cache": "0ms",
        "dnsStart": "+711ms",
        "dns": "0ms",
        "tcpStart": "+711ms",
        "tcp": "0ms",
        "requestStart": "+711ms",
        "responseStart": "+880ms",
        "response": "14ms"
      },
      "initiatorType": "text/plain",
      "contentType": "Others",
      "startTime": 1394,
      "start": "+1.39s",
      "duration": 894,
      "dur": "894ms",
      "differentOriginFlag": false,
      "failedResourceFlag": false,
      "transferSize": "11.19 KB",
      "rawtransfersize": 11458,
      "encodedBodySize": "10.58 KB",
      "decodedBodySize": "10.58 KB",
      "isCache": false,
      "isCompressed": false,
      "timing": {
        "redirectStart": 1394,
        "redirect": 709,
        "phaseGap1start": 2103,
        "phaseGap1": 2,
        "cacheStart": 2105,
        "cache": 0,
        "dnsStart": 2105,
        "dns": 0,
        "phaseGap2start": 2105,
        "phaseGap2": 0,
        "tcpStart": 2105,
        "tcp": 0,
        "phaseGap3start": 2105,
        "phaseGap3": 0,
        "requestStart": 2105,
        "request": 169,
        "responseStart": 2274,
        "response": 14
      }
    },
    {
      "url": "https://10.20.0.65:8443/netstorm/v1/cavisson/netdiagnostics/webddr/guiCancelationTimeOut",
      "filename": "guiCancelationTimeOut",
      "host": "10.20.0.65:8443",
      "nextHopProtocol": "http/1.1",
      "servertimearr": null,
      "tt": {
        "redirectStart": "0ms",
        "redirect": "0ms",
        "cacheStart": "0ms",
        "cache": "0ms",
        "dnsStart": "0ms",
        "dns": "0ms",
        "tcpStart": "0ms",
        "tcp": "0ms",
        "requestStart": "+2ms",
        "responseStart": "+133ms",
        "response": "1ms"
      },
      "initiatorType": "text/plain",
      "contentType": "Others",
      "startTime": 4791,
      "start": "+4.79s",
      "duration": 133,
      "dur": "133ms",
      "differentOriginFlag": false,
      "failedResourceFlag": false,
      "transferSize": "0.22 KB",
      "rawtransfersize": 228,
      "encodedBodySize": "0.01 KB",
      "decodedBodySize": "0.01 KB",
      "isCache": false,
      "isCompressed": false,
      "timing": {
        "redirectStart": 4791,
        "redirect": 0,
        "phaseGap1start": 4791,
        "phaseGap1": 0,
        "cacheStart": 4791,
        "cache": 0,
        "dnsStart": 4791,
        "dns": 0,
        "phaseGap2start": 4791,
        "phaseGap2": 0,
        "tcpStart": 4791,
        "tcp": 0,
        "phaseGap3start": 4791,
        "phaseGap3": 2,
        "requestStart": 4793,
        "request": 131,
        "responseStart": 4924,
        "response": 1
      }
    },
    {
      "url": "https://10.20.0.65:8443/ProductUI/resources/netforest/config.json",
      "filename": "config.json",
      "host": "10.20.0.65:8443",
      "nextHopProtocol": "http/1.1",
      "servertimearr": null,
      "tt": {
        "redirectStart": "0ms",
        "redirect": "0ms",
        "cacheStart": "0ms",
        "cache": "0ms",
        "dnsStart": "0ms",
        "dns": "0ms",
        "tcpStart": "0ms",
        "tcp": "0ms",
        "requestStart": "+3ms",
        "responseStart": "+128ms",
        "response": "1ms"
      },
      "initiatorType": "text/plain",
      "contentType": "Scripts",
      "startTime": 4792,
      "start": "+4.79s",
      "duration": 128,
      "dur": "128ms",
      "differentOriginFlag": false,
      "failedResourceFlag": false,
      "transferSize": "0.65 KB",
      "rawtransfersize": 663,
      "encodedBodySize": "0.33 KB",
      "decodedBodySize": "0.33 KB",
      "isCache": false,
      "isCompressed": false,
      "timing": {
        "redirectStart": 4792,
        "redirect": 0,
        "phaseGap1start": 4792,
        "phaseGap1": 0,
        "cacheStart": 4792,
        "cache": 0,
        "dnsStart": 4792,
        "dns": 0,
        "phaseGap2start": 4792,
        "phaseGap2": 0,
        "tcpStart": 4792,
        "tcp": 0,
        "phaseGap3start": 4792,
        "phaseGap3": 3,
        "requestStart": 4795,
        "request": 125,
        "responseStart": 4920,
        "response": 1
      }
    },
    {
      "url": "https://10.20.0.65:8003/nv/kohls/cav_nv.js",
      "filename": "cav_nv.js",
      "host": "10.20.0.65:8003",
      "nextHopProtocol": "http/1.1",
      "servertimearr": null,
      "tt": {
        "contentload": "-34ms",
        "onload": "+13ms",
        "prt": "-34ms"
      },
      "initiatorType": "text/javascript",
      "contentType": "Scripts",
      "startTime": 4830,
      "start": "+4.83s",
      "duration": 410,
      "dur": "410ms",
      "differentOriginFlag": true,
      "failedResourceFlag": false,
      "transferSize": "-",
      "rawtransfersize": 0,
      "encodedBodySize": "-",
      "decodedBodySize": "-",
      "isCache": false,
      "isCompressed": false,
      "timing": {
        "redirect": "-",
        "cache": "-",
        "dns": "-",
        "tcp": "-",
        "request": "-",
        "response": "-"
      }
    },
    {
      "url": "https://10.20.0.65:8443/ProductUI/resources/themes/theme1/theme.css",
      "filename": "theme.css",
      "host": "10.20.0.65:8443",
      "nextHopProtocol": "http/1.1",
      "servertimearr": null,
      "tt": {
        "redirectStart": "0ms",
        "redirect": "0ms",
        "cacheStart": "0ms",
        "cache": "0ms",
        "dnsStart": "0ms",
        "dns": "0ms",
        "tcpStart": "0ms",
        "tcp": "0ms",
        "requestStart": "+4ms",
        "responseStart": "+101ms",
        "response": "90ms"
      },
      "initiatorType": "text/css",
      "contentType": "Stylesheets",
      "startTime": 4995,
      "start": "+5.00s",
      "duration": 191,
      "dur": "191ms",
      "differentOriginFlag": false,
      "failedResourceFlag": false,
      "transferSize": "34.33 KB",
      "rawtransfersize": 35157,
      "encodedBodySize": "33.49 KB",
      "decodedBodySize": "231.21 KB",
      "isCache": false,
      "isCompressed": true,
      "timing": {
        "redirectStart": 4995,
        "redirect": 0,
        "phaseGap1start": 4995,
        "phaseGap1": 0,
        "cacheStart": 4995,
        "cache": 0,
        "dnsStart": 4995,
        "dns": 0,
        "phaseGap2start": 4995,
        "phaseGap2": 0,
        "tcpStart": 4995,
        "tcp": 0,
        "phaseGap3start": 4995,
        "phaseGap3": 4,
        "requestStart": 4999,
        "request": 97,
        "responseStart": 5096,
        "response": 90
      }
    },
    {
      "url": "https://10.20.0.65:8443/ProductUI/resources/themes/theme1/highchart-colors.js?_=1619441329386",
      "filename": "highchart-colors.js",
      "host": "10.20.0.65:8443",
      "nextHopProtocol": "http/1.1",
      "servertimearr": null,
      "tt": {
        "redirectStart": "0ms",
        "redirect": "0ms",
        "cacheStart": "0ms",
        "cache": "0ms",
        "dnsStart": "0ms",
        "dns": "0ms",
        "tcpStart": "0ms",
        "tcp": "0ms",
        "requestStart": "+7ms",
        "responseStart": "+107ms",
        "response": "1ms"
      },
      "initiatorType": "text/javascript",
      "contentType": "Scripts",
      "startTime": 5004,
      "start": "+5.00s",
      "duration": 107,
      "dur": "107ms",
      "differentOriginFlag": false,
      "failedResourceFlag": false,
      "transferSize": "3.08 KB",
      "rawtransfersize": 3158,
      "encodedBodySize": "2.76 KB",
      "decodedBodySize": "2.76 KB",
      "isCache": false,
      "isCompressed": false,
      "timing": {
        "redirectStart": 5004,
        "redirect": 0,
        "phaseGap1start": 5004,
        "phaseGap1": 0,
        "cacheStart": 5004,
        "cache": 0,
        "dnsStart": 5004,
        "dns": 0,
        "phaseGap2start": 5004,
        "phaseGap2": 0,
        "tcpStart": 5004,
        "tcp": 0,
        "phaseGap3start": 5004,
        "phaseGap3": 7,
        "requestStart": 5011,
        "request": 100,
        "responseStart": 5111,
        "response": 1
      }
    },
    {
      "url": "https://10.20.0.65:8443/ProductUI/productSummary/SummaryWebService/getProductName?productKey=null",
      "filename": "getProductName",
      "host": "10.20.0.65:8443",
      "nextHopProtocol": "http/1.1",
      "servertimearr": null,
      "tt": {
        "redirectStart": "0ms",
        "redirect": "0ms",
        "cacheStart": "0ms",
        "cache": "0ms",
        "dnsStart": "0ms",
        "dns": "0ms",
        "tcpStart": "0ms",
        "tcp": "0ms",
        "requestStart": "+4ms",
        "responseStart": "+147ms",
        "response": "0ms"
      },
      "initiatorType": "text/plain",
      "contentType": "Others",
      "startTime": 5011,
      "start": "+5.01s",
      "duration": 147,
      "dur": "147ms",
      "differentOriginFlag": false,
      "failedResourceFlag": false,
      "transferSize": "0.68 KB",
      "rawtransfersize": 700,
      "encodedBodySize": "0.44 KB",
      "decodedBodySize": "0.58 KB",
      "isCache": false,
      "isCompressed": true,
      "timing": {
        "redirectStart": 5011,
        "redirect": 0,
        "phaseGap1start": 5011,
        "phaseGap1": 0,
        "cacheStart": 5011,
        "cache": 0,
        "dnsStart": 5011,
        "dns": 0,
        "phaseGap2start": 5011,
        "phaseGap2": 0,
        "tcpStart": 5011,
        "tcp": 0,
        "phaseGap3start": 5011,
        "phaseGap3": 4,
        "requestStart": 5015,
        "request": 143,
        "responseStart": 5158,
        "response": 0
      }
    },
    {
      "url": "https://10.20.0.65:8443/ProductUI/productSummary/SummaryWebService/getRefreshIntervalTime?productKey=null",
      "filename": "getRefreshIntervalTime",
      "host": "10.20.0.65:8443",
      "nextHopProtocol": "http/1.1",
      "servertimearr": null,
      "tt": {
        "redirectStart": "0ms",
        "redirect": "0ms",
        "cacheStart": "0ms",
        "cache": "0ms",
        "dnsStart": "0ms",
        "dns": "0ms",
        "tcpStart": "0ms",
        "tcp": "0ms",
        "requestStart": "+3ms",
        "responseStart": "+133ms",
        "response": "0ms"
      },
      "initiatorType": "text/plain",
      "contentType": "Others",
      "startTime": 5014,
      "start": "+5.01s",
      "duration": 132,
      "dur": "132ms",
      "differentOriginFlag": false,
      "failedResourceFlag": false,
      "transferSize": "0.35 KB",
      "rawtransfersize": 358,
      "encodedBodySize": "0.10 KB",
      "decodedBodySize": "0.21 KB",
      "isCache": false,
      "isCompressed": true,
      "timing": {
        "redirectStart": 5014,
        "redirect": 0,
        "phaseGap1start": 5014,
        "phaseGap1": 0,
        "cacheStart": 5014,
        "cache": 0,
        "dnsStart": 5014,
        "dns": 0,
        "phaseGap2start": 5014,
        "phaseGap2": 0,
        "tcpStart": 5014,
        "tcp": 0,
        "phaseGap3start": 5014,
        "phaseGap3": 3,
        "requestStart": 5017,
        "request": 130,
        "responseStart": 5147,
        "response": 0
      }
    },
    {
      "url": "https://10.20.0.65:8443/ProductUI/images/logo_circle.png",
      "filename": "logo_circle.png",
      "host": "10.20.0.65:8443",
      "nextHopProtocol": "http/1.1",
      "servertimearr": null,
      "tt": {
        "redirectStart": "0ms",
        "redirect": "0ms",
        "cacheStart": "0ms",
        "cache": "0ms",
        "dnsStart": "0ms",
        "dns": "0ms",
        "tcpStart": "0ms",
        "tcp": "0ms",
        "requestStart": "+2ms",
        "responseStart": "+80ms",
        "response": "107ms"
      },
      "initiatorType": "image/png",
      "contentType": "Images",
      "startTime": 5196,
      "start": "+5.20s",
      "duration": 187,
      "dur": "187ms",
      "differentOriginFlag": false,
      "failedResourceFlag": false,
      "transferSize": "95.47 KB",
      "rawtransfersize": 97759,
      "encodedBodySize": "93.79 KB",
      "decodedBodySize": "101.50 KB",
      "isCache": false,
      "isCompressed": true,
      "timing": {
        "redirectStart": 5196,
        "redirect": 0,
        "phaseGap1start": 5196,
        "phaseGap1": 0,
        "cacheStart": 5196,
        "cache": 0,
        "dnsStart": 5196,
        "dns": 0,
        "phaseGap2start": 5196,
        "phaseGap2": 0,
        "tcpStart": 5196,
        "tcp": 0,
        "phaseGap3start": 5196,
        "phaseGap3": 2,
        "requestStart": 5198,
        "request": 78,
        "responseStart": 5276,
        "response": 107
      }
    },
    {
      "url": "https://10.20.0.65:8443/ProductUI/images/netvision.png",
      "filename": "netvision.png",
      "host": "10.20.0.65:8443",
      "nextHopProtocol": "http/1.1",
      "servertimearr": null,
      "tt": {
        "redirectStart": "0ms",
        "redirect": "0ms",
        "cacheStart": "0ms",
        "cache": "0ms",
        "dnsStart": "0ms",
        "dns": "0ms",
        "tcpStart": "0ms",
        "tcp": "0ms",
        "requestStart": "+4ms",
        "responseStart": "+91ms",
        "response": "2ms"
      },
      "initiatorType": "image/png",
      "contentType": "Images",
      "startTime": 5197,
      "start": "+5.20s",
      "duration": 92,
      "dur": "92ms",
      "differentOriginFlag": false,
      "failedResourceFlag": false,
      "transferSize": "8.69 KB",
      "rawtransfersize": 8896,
      "encodedBodySize": "8.37 KB",
      "decodedBodySize": "8.37 KB",
      "isCache": false,
      "isCompressed": false,
      "timing": {
        "redirectStart": 5197,
        "redirect": 0,
        "phaseGap1start": 5197,
        "phaseGap1": 0,
        "cacheStart": 5197,
        "cache": 0,
        "dnsStart": 5197,
        "dns": 0,
        "phaseGap2start": 5197,
        "phaseGap2": 0,
        "tcpStart": 5197,
        "tcp": 0,
        "phaseGap3start": 5197,
        "phaseGap3": 4,
        "requestStart": 5201,
        "request": 87,
        "responseStart": 5288,
        "response": 2
      }
    },
    {
      "url": "https://10.20.0.65:8443/ProductUI/fontawesome-webfont.af7ae505a9eed503f8b8.woff2?v=4.7.0",
      "filename": "fontawesome-webfont.af7ae505a9eed503f8b8.woff2",
      "host": "10.20.0.65:8443",
      "nextHopProtocol": "http/1.1",
      "servertimearr": null,
      "tt": {
        "redirectStart": "0ms",
        "redirect": "0ms",
        "cacheStart": "0ms",
        "cache": "0ms",
        "dnsStart": "0ms",
        "dns": "0ms",
        "tcpStart": "0ms",
        "tcp": "0ms",
        "requestStart": "+33ms",
        "responseStart": "+126ms",
        "response": "216ms"
      },
      "initiatorType": "text/plain",
      "contentType": "Others",
      "startTime": 5228,
      "start": "+5.23s",
      "duration": 342,
      "dur": "342ms",
      "differentOriginFlag": false,
      "failedResourceFlag": false,
      "transferSize": "75.64 KB",
      "rawtransfersize": 77459,
      "encodedBodySize": "75.35 KB",
      "decodedBodySize": "75.35 KB",
      "isCache": false,
      "isCompressed": false,
      "timing": {
        "redirectStart": 5228,
        "redirect": 0,
        "phaseGap1start": 5228,
        "phaseGap1": 0,
        "cacheStart": 5228,
        "cache": 0,
        "dnsStart": 5228,
        "dns": 0,
        "phaseGap2start": 5228,
        "phaseGap2": 0,
        "tcpStart": 5228,
        "tcp": 0,
        "phaseGap3start": 5228,
        "phaseGap3": 33,
        "requestStart": 5261,
        "request": 93,
        "responseStart": 5354,
        "response": 216
      }
    },
    {
      "url": "https://10.20.0.65:8003/nv/ios/CheckEntry/config.js",
      "filename": "config.js",
      "host": "10.20.0.65:8003",
      "nextHopProtocol": "http/1.1",
      "servertimearr": null,
      "tt": {
        "contentload": "-503ms",
        "onload": "-456ms",
        "prt": "-503ms"
      },
      "initiatorType": "text/javascript",
      "contentType": "Scripts",
      "startTime": 5299,
      "start": "+5.30s",
      "duration": 295,
      "dur": "295ms",
      "differentOriginFlag": true,
      "failedResourceFlag": false,
      "transferSize": "-",
      "rawtransfersize": 0,
      "encodedBodySize": "-",
      "decodedBodySize": "-",
      "isCache": false,
      "isCompressed": false,
      "timing": {
        "redirect": "-",
        "cache": "-",
        "dns": "-",
        "tcp": "-",
        "request": "-",
        "response": "-"
      }
    }
  ],
  "bloaddata": {
    "2": "https://fonts.googleapis.com/css?family=Roboto:400,500",
    "3": "https://fonts.googleapis.com/icon?family=Material Icons",
    "92": "https://10.20.0.65:8443/ProductUI/images/netvision.png",
    "107": "https://10.20.0.65:8443/ProductUI/resources/themes/theme1/highchart-colors.js?_=1619441329386",
    "109": "https://10.20.0.65:8443/ProductUI/resources/netvision/css/bootstrap.min.3.4.1.css",
    "128": "https://10.20.0.65:8443/ProductUI/resources/netforest/config.json",
    "132": "https://10.20.0.65:8443/ProductUI/productSummary/SummaryWebService/getRefreshIntervalTime?productKey=null",
    "133": "https://10.20.0.65:8443/netstorm/v1/cavisson/netdiagnostics/webddr/guiCancelationTimeOut",
    "147": "https://10.20.0.65:8443/ProductUI/productSummary/SummaryWebService/getProductName?productKey=null",
    "187": "https://10.20.0.65:8443/ProductUI/images/logo_circle.png",
    "191": "https://10.20.0.65:8443/ProductUI/resources/themes/theme1/theme.css",
    "274": "https://10.20.0.65:8443/ProductUI/runtime.a8bbab97b14a864a1784.js",
    "295": "https://10.20.0.65:8003/nv/ios/CheckEntry/config.js",
    "342": "https://10.20.0.65:8443/ProductUI/fontawesome-webfont.af7ae505a9eed503f8b8.woff2?v=4.7.0",
    "410": "https://10.20.0.65:8003/nv/kohls/cav_nv.js",
    "494": "https://10.20.0.65:8443/ProductUI/polyfills.72b5a3be2aa4fdef3477.js",
    "584": "https://10.20.0.65:8443/ProductUI/#/login",
    "661": "https://10.20.0.65:8443/ProductUI/styles.87f92f4e6cbbc5053367.css",
    "894": "https://10.20.0.65:8443/ProductUI/#NVURL",
    "935": "https://10.20.0.65:8443/ProductUI/scripts.675d3bf2da0635286b25.js",
    "1445": "https://10.20.0.65:8003/nv/kohls/nv_bootstrap.js",
    "1725": "https://10.20.0.65:8443/ProductUI/images/new_logo-o.png",
    "3222": "https://10.20.0.65:8443/ProductUI/vendor.cbb7e3b83ba16fa14ab1.js",
    "3506": "https://10.20.0.65:8443/ProductUI/main.e9eda7136a72a72234e0.js"
  },
  "bresponsedata": {
    "1": "https://fonts.googleapis.com/icon?family=Material Icons",
    "2": "https://10.20.0.65:8443/ProductUI/images/netvision.png",
    "3": "https://10.20.0.65:8443/ProductUI/resources/netvision/css/bootstrap.min.3.4.1.css",
    "14": "https://10.20.0.65:8443/ProductUI/#NVURL",
    "90": "https://10.20.0.65:8443/ProductUI/resources/themes/theme1/theme.css",
    "106": "https://10.20.0.65:8443/ProductUI/images/logo_circle.png",
    "122": "https://10.20.0.65:8443/ProductUI/polyfills.72b5a3be2aa4fdef3477.js",
    "215": "https://10.20.0.65:8443/ProductUI/fontawesome-webfont.af7ae505a9eed503f8b8.woff2?v=4.7.0",
    "281": "https://10.20.0.65:8443/ProductUI/images/new_logo-o.png",
    "346": "https://10.20.0.65:8443/ProductUI/scripts.675d3bf2da0635286b25.js",
    "465": "https://10.20.0.65:8443/ProductUI/styles.87f92f4e6cbbc5053367.css",
    "2450": "https://10.20.0.65:8443/ProductUI/vendor.cbb7e3b83ba16fa14ab1.js",
    "2470": "https://10.20.0.65:8443/ProductUI/main.e9eda7136a72a72234e0.js"
  },
  "bdnsdata": null,
  "bconnectdata": {
    "379": {
      "url": "https://10.20.0.65:8443/ProductUI/images/new_logo-o.png",
      "host": "10.20.0.65:8443"
    }
  },
  "hostdata": {
    "hostName": [
      "10.20.0.65:8003",
      "10.20.0.65:8443",
      "fonts.googleapis.com"
    ],
    "hostRequest": [
      3,
      20,
      2
    ],
    "hostRequestPct": [
      "12.00",
      "80.00",
      "8.00"
    ],
    "hostObj": {
      "10.20.0.65:8443": {
        "time": 14054,
        "count": 20,
        "dns": 0,
        "tcp": 379
      },
      "10.20.0.65:8003": {
        "time": 2150,
        "count": 3,
        "dns": 0,
        "tcp": 0
      },
      "fonts.googleapis.com": {
        "time": 5,
        "count": 2,
        "dns": 0,
        "tcp": 0
      }
    },
    "totalResponse": 16209,
    "dataArray": null,
    "pieData": [
      {
        "name": "10.20.0.65:8443",
        "y": 86.7
      },
      {
        "name": "10.20.0.65:8003",
        "y": 13.26
      },
      {
        "name": "fonts.googleapis.com",
        "y": 0.03
      }
    ],
    "hostTableData": [
      {
        "hostName": "10.20.0.65:8003",
        "hostRequest": 3,
        "hostRequestPct": 12,
        "hostAvgResponse": 716.67,
        "hostLoadDuration": 13.26
      },
      {
        "hostName": "10.20.0.65:8443",
        "hostRequest": 20,
        "hostRequestPct": 80,
        "hostAvgResponse": 702.7,
        "hostLoadDuration": 86.7
      },
      {
        "hostName": "fonts.googleapis.com",
        "hostRequest": 2,
        "hostRequestPct": 8,
        "hostAvgResponse": 2.5,
        "hostLoadDuration": 0.03
      }
    ]
  },
  "contentdata": {
    "har": {
      "_page_timings": null,
      "log": {
        "_entries": [],
        "creator": {
          "name": "Ana Har Generator",
          "version": "1.1"
        },
        "entries": [
          {
            "_timings": {
              "connectEnd": 483,
              "connection": 0,
              "connectionCount": 0,
              "connectionStartCount": 0,
              "connectStart": 483,
              "count": 0,
              "domainLookup": 0,
              "domainLookupCount": 0,
              "domainLookupEnd": 483,
              "domainLookupStart": 483,
              "domainLookupStartCount": 0,
              "fetchStart": 483,
              "fetchStartCount": 0,
              "redirect": 0,
              "redirectCount": 0,
              "redirectEnd": 483,
              "redirectStart": 4,
              "redirectStartCount": 0,
              "requestStart": 486,
              "requestStartCount": 0,
              "response": 0,
              "responseCount": 0,
              "responseEnd": 584,
              "responseStart": 583,
              "responseStartCount": 0,
              "secureConnectionStart": 0,
              "secureConnectionStartCount": 0
            },
            "cache": {},
            "connection": "-1",
            "pageref": "page_1",
            "request": {
              "bodySize": 0,
              "cookies": [],
              "headers": [],
              "headersSize": 0,
              "httpVersion": "HTTP/1.1",
              "method": "GET",
              "queryString": [],
              "url": "https://10.20.0.65:8443/ProductUI/#/login"
            },
            "response": {
              "bodySize": 0,
              "content": {
                "compression": -1,
                "mimeType": "text/plain",
                "size": -1,
                "text": ""
              },
              "cookies": [],
              "decodedBodySize": 10834,
              "encodedBodySize": 10834,
              "headers": [],
              "headersSize": 0,
              "httpVersion": "HTTP/1.1",
              "nextHopProtocol": "http/1.1",
              "redirectURL": "",
              "status": "200",
              "statusText": "OK",
              "transferSize": 12516
            },
            "serverIPAddress": "127.0.0.1",
            "serverTimings": null,
            "startedDateTime": "9331-02-04T04:30:00.000-06:00",
            "startedTimeInMillis": 0,
            "time": 584,
            "timings": {
              "blocked": 0,
              "connect": 0,
              "dns": 0,
              "receive": 1,
              "send": -1,
              "ssl": -1,
              "wait": 97
            }
          },
          {
            "_timings": {
              "connectEnd": 634,
              "connection": 0,
              "connectionCount": 0,
              "connectionStartCount": 0,
              "connectStart": 634,
              "count": 0,
              "domainLookup": 0,
              "domainLookupCount": 0,
              "domainLookupEnd": 634,
              "domainLookupStart": 634,
              "domainLookupStartCount": 0,
              "fetchStart": 634,
              "fetchStartCount": 0,
              "redirect": 0,
              "redirectCount": 0,
              "redirectEnd": 0,
              "redirectStart": 0,
              "redirectStartCount": 0,
              "requestStart": 640,
              "requestStartCount": 0,
              "response": 0,
              "responseCount": 0,
              "responseEnd": 744,
              "responseStart": 741,
              "responseStartCount": 0,
              "secureConnectionStart": 634,
              "secureConnectionStartCount": 0
            },
            "cache": {},
            "connection": "-1",
            "pageref": "page_1",
            "request": {
              "bodySize": 0,
              "cookies": [],
              "headers": [],
              "headersSize": 0,
              "httpVersion": "HTTP/1.1",
              "method": "GET",
              "queryString": [],
              "url": "https://10.20.0.65:8443/ProductUI/resources/netvision/css/bootstrap.min.3.4.1.css"
            },
            "response": {
              "bodySize": 0,
              "content": {
                "compression": -1,
                "mimeType": "text/css",
                "size": -1,
                "text": ""
              },
              "cookies": [],
              "decodedBodySize": 121462,
              "encodedBodySize": 19741,
              "headers": [],
              "headersSize": 0,
              "httpVersion": "HTTP/1.1",
              "nextHopProtocol": "http/1.1",
              "redirectURL": "",
              "status": "200",
              "statusText": "OK",
              "transferSize": 20400
            },
            "serverIPAddress": "127.0.0.1",
            "serverTimings": null,
            "startedDateTime": "9331-02-04T04:30:00.634-06:00",
            "startedTimeInMillis": 0,
            "time": 109,
            "timings": {
              "blocked": 0,
              "connect": 0,
              "dns": 0,
              "receive": 3,
              "send": -1,
              "ssl": 0,
              "wait": 101
            }
          },
          {
            "_timings": {
              "connectEnd": 636,
              "connection": 0,
              "connectionCount": 0,
              "connectionStartCount": 0,
              "connectStart": 636,
              "count": 0,
              "domainLookup": 0,
              "domainLookupCount": 0,
              "domainLookupEnd": 636,
              "domainLookupStart": 636,
              "domainLookupStartCount": 0,
              "fetchStart": 636,
              "fetchStartCount": 0,
              "redirect": 0,
              "redirectCount": 0,
              "redirectEnd": 0,
              "redirectStart": 0,
              "redirectStartCount": 0,
              "requestStart": 644,
              "requestStartCount": 0,
              "response": 0,
              "responseCount": 0,
              "responseEnd": 827,
              "responseStart": 737,
              "responseStartCount": 0,
              "secureConnectionStart": 636,
              "secureConnectionStartCount": 0
            },
            "cache": {},
            "connection": "-1",
            "pageref": "page_1",
            "request": {
              "bodySize": 0,
              "cookies": [],
              "headers": [],
              "headersSize": 0,
              "httpVersion": "HTTP/1.1",
              "method": "GET",
              "queryString": [],
              "url": "https://10.20.0.65:8443/ProductUI/resources/unified-icons/unified-icons.css"
            },
            "response": {
              "bodySize": 0,
              "content": {
                "compression": -1,
                "mimeType": "text/css",
                "size": -1,
                "text": ""
              },
              "cookies": [],
              "decodedBodySize": 32999,
              "encodedBodySize": 32999,
              "headers": [],
              "headersSize": 0,
              "httpVersion": "HTTP/1.1",
              "nextHopProtocol": "http/1.1",
              "redirectURL": "",
              "status": "200",
              "statusText": "OK",
              "transferSize": 33322
            },
            "serverIPAddress": "127.0.0.1",
            "serverTimings": null,
            "startedDateTime": "9331-02-04T04:30:00.636-06:00",
            "startedTimeInMillis": 0,
            "time": 191,
            "timings": {
              "blocked": 0,
              "connect": 0,
              "dns": 0,
              "receive": 90,
              "send": -1,
              "ssl": 0,
              "wait": 92
            }
          },
          {
            "_timings": {
              "connectEnd": 640,
              "connection": 0,
              "connectionCount": 0,
              "connectionStartCount": 0,
              "connectStart": 640,
              "count": 0,
              "domainLookup": 0,
              "domainLookupCount": 0,
              "domainLookupEnd": 640,
              "domainLookupStart": 640,
              "domainLookupStartCount": 0,
              "fetchStart": 640,
              "fetchStartCount": 0,
              "redirect": 0,
              "redirectCount": 0,
              "redirectEnd": 0,
              "redirectStart": 0,
              "redirectStartCount": 0,
              "requestStart": 745,
              "requestStartCount": 0,
              "response": 0,
              "responseCount": 0,
              "responseEnd": 1301,
              "responseStart": 836,
              "responseStartCount": 0,
              "secureConnectionStart": 640,
              "secureConnectionStartCount": 0
            },
            "cache": {},
            "connection": "-1",
            "pageref": "page_1",
            "request": {
              "bodySize": 0,
              "cookies": [],
              "headers": [],
              "headersSize": 0,
              "httpVersion": "HTTP/1.1",
              "method": "GET",
              "queryString": [],
              "url": "https://10.20.0.65:8443/ProductUI/styles.87f92f4e6cbbc5053367.css"
            },
            "response": {
              "bodySize": 0,
              "content": {
                "compression": -1,
                "mimeType": "text/css",
                "size": -1,
                "text": ""
              },
              "cookies": [],
              "decodedBodySize": 2192926,
              "encodedBodySize": 280722,
              "headers": [],
              "headersSize": 0,
              "httpVersion": "HTTP/1.1",
              "nextHopProtocol": "http/1.1",
              "redirectURL": "",
              "status": "200",
              "statusText": "OK",
              "transferSize": 284969
            },
            "serverIPAddress": "127.0.0.1",
            "serverTimings": null,
            "startedDateTime": "9331-02-04T04:30:00.640-06:00",
            "startedTimeInMillis": 0,
            "time": 661,
            "timings": {
              "blocked": 0,
              "connect": 0,
              "dns": 0,
              "receive": 465,
              "send": -1,
              "ssl": 0,
              "wait": 90
            }
          },
          {
            "_timings": {
              "connectEnd": 1978,
              "connection": 0,
              "connectionCount": 0,
              "connectionStartCount": 0,
              "connectStart": 1599,
              "count": 0,
              "domainLookup": 0,
              "domainLookupCount": 0,
              "domainLookupEnd": 1599,
              "domainLookupStart": 1599,
              "domainLookupStartCount": 0,
              "fetchStart": 644,
              "fetchStartCount": 0,
              "redirect": 0,
              "redirectCount": 0,
              "redirectEnd": 0,
              "redirectStart": 0,
              "redirectStartCount": 0,
              "requestStart": 1978,
              "requestStartCount": 0,
              "response": 0,
              "responseCount": 0,
              "responseEnd": 2369,
              "responseStart": 2087,
              "responseStartCount": 0,
              "secureConnectionStart": 1675,
              "secureConnectionStartCount": 0
            },
            "cache": {},
            "connection": "-1",
            "pageref": "page_1",
            "request": {
              "bodySize": 0,
              "cookies": [],
              "headers": [],
              "headersSize": 0,
              "httpVersion": "HTTP/1.1",
              "method": "GET",
              "queryString": [],
              "url": "https://10.20.0.65:8443/ProductUI/images/new_logo-o.png"
            },
            "response": {
              "bodySize": 0,
              "content": {
                "compression": -1,
                "mimeType": "image/png",
                "size": -1,
                "text": ""
              },
              "cookies": [],
              "decodedBodySize": 71075,
              "encodedBodySize": 71075,
              "headers": [],
              "headersSize": 0,
              "httpVersion": "HTTP/1.1",
              "nextHopProtocol": "http/1.1",
              "redirectURL": "",
              "status": "200",
              "statusText": "OK",
              "transferSize": 71399
            },
            "serverIPAddress": "127.0.0.1",
            "serverTimings": null,
            "startedDateTime": "9331-02-04T04:30:00.644-06:00",
            "startedTimeInMillis": 0,
            "time": 1725,
            "timings": {
              "blocked": 954,
              "connect": 379,
              "dns": 0,
              "receive": 281,
              "send": -1,
              "ssl": 302,
              "wait": 109
            }
          },
          {
            "_timings": {
              "connectEnd": 644,
              "connection": 0,
              "connectionCount": 0,
              "connectionStartCount": 0,
              "connectStart": 644,
              "count": 0,
              "domainLookup": 0,
              "domainLookupCount": 0,
              "domainLookupEnd": 644,
              "domainLookupStart": 644,
              "domainLookupStartCount": 0,
              "fetchStart": 644,
              "fetchStartCount": 0,
              "redirect": 0,
              "redirectCount": 0,
              "redirectEnd": 0,
              "redirectStart": 0,
              "redirectStartCount": 0,
              "requestStart": 834,
              "requestStartCount": 0,
              "response": 0,
              "responseCount": 0,
              "responseEnd": 919,
              "responseStart": 918,
              "responseStartCount": 0,
              "secureConnectionStart": 644,
              "secureConnectionStartCount": 0
            },
            "cache": {},
            "connection": "-1",
            "pageref": "page_1",
            "request": {
              "bodySize": 0,
              "cookies": [],
              "headers": [],
              "headersSize": 0,
              "httpVersion": "HTTP/1.1",
              "method": "GET",
              "queryString": [],
              "url": "https://10.20.0.65:8443/ProductUI/runtime.a8bbab97b14a864a1784.js"
            },
            "response": {
              "bodySize": 0,
              "content": {
                "compression": -1,
                "mimeType": "text/javascript",
                "size": -1,
                "text": ""
              },
              "cookies": [],
              "decodedBodySize": 6909,
              "encodedBodySize": 6909,
              "headers": [],
              "headersSize": 0,
              "httpVersion": "HTTP/1.1",
              "nextHopProtocol": "http/1.1",
              "redirectURL": "",
              "status": "200",
              "statusText": "OK",
              "transferSize": 7244
            },
            "serverIPAddress": "127.0.0.1",
            "serverTimings": null,
            "startedDateTime": "9331-02-04T04:30:00.644-06:00",
            "startedTimeInMillis": 0,
            "time": 274,
            "timings": {
              "blocked": 0,
              "connect": 0,
              "dns": 0,
              "receive": 0,
              "send": -1,
              "ssl": 0,
              "wait": 84
            }
          },
          {
            "_timings": {
              "connectEnd": 645,
              "connection": 0,
              "connectionCount": 0,
              "connectionStartCount": 0,
              "connectStart": 645,
              "count": 0,
              "domainLookup": 0,
              "domainLookupCount": 0,
              "domainLookupEnd": 645,
              "domainLookupStart": 645,
              "domainLookupStartCount": 0,
              "fetchStart": 645,
              "fetchStartCount": 0,
              "redirect": 0,
              "redirectCount": 0,
              "redirectEnd": 0,
              "redirectStart": 0,
              "redirectStartCount": 0,
              "requestStart": 922,
              "requestStartCount": 0,
              "response": 0,
              "responseCount": 0,
              "responseEnd": 1139,
              "responseStart": 1017,
              "responseStartCount": 0,
              "secureConnectionStart": 645,
              "secureConnectionStartCount": 0
            },
            "cache": {},
            "connection": "-1",
            "pageref": "page_1",
            "request": {
              "bodySize": 0,
              "cookies": [],
              "headers": [],
              "headersSize": 0,
              "httpVersion": "HTTP/1.1",
              "method": "GET",
              "queryString": [],
              "url": "https://10.20.0.65:8443/ProductUI/polyfills.72b5a3be2aa4fdef3477.js"
            },
            "response": {
              "bodySize": 0,
              "content": {
                "compression": -1,
                "mimeType": "text/javascript",
                "size": -1,
                "text": ""
              },
              "cookies": [],
              "decodedBodySize": 93726,
              "encodedBodySize": 93726,
              "headers": [],
              "headersSize": 0,
              "httpVersion": "HTTP/1.1",
              "nextHopProtocol": "http/1.1",
              "redirectURL": "",
              "status": "200",
              "statusText": "OK",
              "transferSize": 94063
            },
            "serverIPAddress": "127.0.0.1",
            "serverTimings": null,
            "startedDateTime": "9331-02-04T04:30:00.645-06:00",
            "startedTimeInMillis": 0,
            "time": 494,
            "timings": {
              "blocked": 0,
              "connect": 0,
              "dns": 0,
              "receive": 122,
              "send": -1,
              "ssl": 0,
              "wait": 94
            }
          },
          {
            "_timings": {
              "connectEnd": 645,
              "connection": 0,
              "connectionCount": 0,
              "connectionStartCount": 0,
              "connectStart": 645,
              "count": 0,
              "domainLookup": 0,
              "domainLookupCount": 0,
              "domainLookupEnd": 645,
              "domainLookupStart": 645,
              "domainLookupStartCount": 0,
              "fetchStart": 645,
              "fetchStartCount": 0,
              "redirect": 0,
              "redirectCount": 0,
              "redirectEnd": 0,
              "redirectStart": 0,
              "redirectStartCount": 0,
              "requestStart": 1148,
              "requestStartCount": 0,
              "response": 0,
              "responseCount": 0,
              "responseEnd": 1580,
              "responseStart": 1234,
              "responseStartCount": 0,
              "secureConnectionStart": 645,
              "secureConnectionStartCount": 0
            },
            "cache": {},
            "connection": "-1",
            "pageref": "page_1",
            "request": {
              "bodySize": 0,
              "cookies": [],
              "headers": [],
              "headersSize": 0,
              "httpVersion": "HTTP/1.1",
              "method": "GET",
              "queryString": [],
              "url": "https://10.20.0.65:8443/ProductUI/scripts.675d3bf2da0635286b25.js"
            },
            "response": {
              "bodySize": 0,
              "content": {
                "compression": -1,
                "mimeType": "text/javascript",
                "size": -1,
                "text": ""
              },
              "cookies": [],
              "decodedBodySize": 706804,
              "encodedBodySize": 216697,
              "headers": [],
              "headersSize": 0,
              "httpVersion": "HTTP/1.1",
              "nextHopProtocol": "http/1.1",
              "redirectURL": "",
              "status": "200",
              "statusText": "OK",
              "transferSize": 220088
            },
            "serverIPAddress": "127.0.0.1",
            "serverTimings": null,
            "startedDateTime": "9331-02-04T04:30:00.645-06:00",
            "startedTimeInMillis": 0,
            "time": 935,
            "timings": {
              "blocked": 0,
              "connect": 0,
              "dns": 0,
              "receive": 346,
              "send": -1,
              "ssl": 0,
              "wait": 85
            }
          },
          {
            "_timings": {
              "connectEnd": 645,
              "connection": 0,
              "connectionCount": 0,
              "connectionStartCount": 0,
              "connectStart": 645,
              "count": 0,
              "domainLookup": 0,
              "domainLookupCount": 0,
              "domainLookupEnd": 645,
              "domainLookupStart": 645,
              "domainLookupStartCount": 0,
              "fetchStart": 645,
              "fetchStartCount": 0,
              "redirect": 0,
              "redirectCount": 0,
              "redirectEnd": 0,
              "redirectStart": 0,
              "redirectStartCount": 0,
              "requestStart": 1303,
              "requestStartCount": 0,
              "response": 0,
              "responseCount": 0,
              "responseEnd": 3868,
              "responseStart": 1417,
              "responseStartCount": 0,
              "secureConnectionStart": 645,
              "secureConnectionStartCount": 0
            },
            "cache": {},
            "connection": "-1",
            "pageref": "page_1",
            "request": {
              "bodySize": 0,
              "cookies": [],
              "headers": [],
              "headersSize": 0,
              "httpVersion": "HTTP/1.1",
              "method": "GET",
              "queryString": [],
              "url": "https://10.20.0.65:8443/ProductUI/vendor.cbb7e3b83ba16fa14ab1.js"
            },
            "response": {
              "bodySize": 0,
              "content": {
                "compression": -1,
                "mimeType": "text/javascript",
                "size": -1,
                "text": ""
              },
              "cookies": [],
              "decodedBodySize": 7053013,
              "encodedBodySize": 1495277,
              "headers": [],
              "headersSize": 0,
              "httpVersion": "HTTP/1.1",
              "nextHopProtocol": "http/1.1",
              "redirectURL": "",
              "status": "200",
              "statusText": "OK",
              "transferSize": 1516296
            },
            "serverIPAddress": "127.0.0.1",
            "serverTimings": null,
            "startedDateTime": "9331-02-04T04:30:00.645-06:00",
            "startedTimeInMillis": 0,
            "time": 3222,
            "timings": {
              "blocked": 0,
              "connect": 0,
              "dns": 0,
              "receive": 2450,
              "send": -1,
              "ssl": 0,
              "wait": 114
            }
          },
          {
            "_timings": {
              "connectEnd": 646,
              "connection": 0,
              "connectionCount": 0,
              "connectionStartCount": 0,
              "connectStart": 646,
              "count": 0,
              "domainLookup": 0,
              "domainLookupCount": 0,
              "domainLookupEnd": 646,
              "domainLookupStart": 646,
              "domainLookupStartCount": 0,
              "fetchStart": 646,
              "fetchStartCount": 0,
              "redirect": 0,
              "redirectCount": 0,
              "redirectEnd": 0,
              "redirectStart": 0,
              "redirectStartCount": 0,
              "requestStart": 1581,
              "requestStartCount": 0,
              "response": 0,
              "responseCount": 0,
              "responseEnd": 4152,
              "responseStart": 1682,
              "responseStartCount": 0,
              "secureConnectionStart": 646,
              "secureConnectionStartCount": 0
            },
            "cache": {},
            "connection": "-1",
            "pageref": "page_1",
            "request": {
              "bodySize": 0,
              "cookies": [],
              "headers": [],
              "headersSize": 0,
              "httpVersion": "HTTP/1.1",
              "method": "GET",
              "queryString": [],
              "url": "https://10.20.0.65:8443/ProductUI/main.e9eda7136a72a72234e0.js"
            },
            "response": {
              "bodySize": 0,
              "content": {
                "compression": -1,
                "mimeType": "text/javascript",
                "size": -1,
                "text": ""
              },
              "cookies": [],
              "decodedBodySize": 11128024,
              "encodedBodySize": 1565726,
              "headers": [],
              "headersSize": 0,
              "httpVersion": "HTTP/1.1",
              "nextHopProtocol": "http/1.1",
              "redirectURL": "",
              "status": "200",
              "statusText": "OK",
              "transferSize": 1587721
            },
            "serverIPAddress": "127.0.0.1",
            "serverTimings": null,
            "startedDateTime": "9331-02-04T04:30:00.646-06:00",
            "startedTimeInMillis": 0,
            "time": 3506,
            "timings": {
              "blocked": 0,
              "connect": 0,
              "dns": 0,
              "receive": 2470,
              "send": -1,
              "ssl": 0,
              "wait": 100
            }
          },
          {
            "_timings": {
              "connectEnd": 0,
              "connection": 0,
              "connectionCount": 0,
              "connectionStartCount": 0,
              "connectStart": 0,
              "count": 0,
              "domainLookup": 0,
              "domainLookupCount": 0,
              "domainLookupEnd": 0,
              "domainLookupStart": 0,
              "domainLookupStartCount": 0,
              "fetchStart": 646,
              "fetchStartCount": 0,
              "redirect": 0,
              "redirectCount": 0,
              "redirectEnd": 0,
              "redirectStart": 0,
              "redirectStartCount": 0,
              "requestStart": 0,
              "requestStartCount": 0,
              "response": 0,
              "responseCount": 0,
              "responseEnd": 2091,
              "responseStart": 0,
              "responseStartCount": 0,
              "secureConnectionStart": 0,
              "secureConnectionStartCount": 0
            },
            "cache": {},
            "connection": "-1",
            "pageref": "page_1",
            "request": {
              "bodySize": 0,
              "cookies": [],
              "headers": [],
              "headersSize": 0,
              "httpVersion": "HTTP/1.1",
              "method": "GET",
              "queryString": [],
              "url": "https://10.20.0.65:8003/nv/kohls/nv_bootstrap.js"
            },
            "response": {
              "bodySize": 0,
              "content": {
                "compression": -1,
                "mimeType": "text/javascript",
                "size": -1,
                "text": ""
              },
              "cookies": [],
              "decodedBodySize": 0,
              "encodedBodySize": 0,
              "headers": [],
              "headersSize": 0,
              "httpVersion": "HTTP/1.1",
              "nextHopProtocol": "http/1.1",
              "redirectURL": "",
              "status": "200",
              "statusText": "OK",
              "transferSize": 0
            },
            "serverIPAddress": "127.0.0.1",
            "serverTimings": null,
            "startedDateTime": "9331-02-04T04:30:00.646-06:00",
            "startedTimeInMillis": 0,
            "time": 1445,
            "timings": {
              "blocked": -1,
              "connect": -1,
              "dns": -1,
              "receive": -1,
              "send": -1,
              "ssl": -1,
              "wait": -1
            }
          },
          {
            "_timings": {
              "connectEnd": 1309,
              "connection": 0,
              "connectionCount": 0,
              "connectionStartCount": 0,
              "connectStart": 1309,
              "count": 0,
              "domainLookup": 0,
              "domainLookupCount": 0,
              "domainLookupEnd": 1309,
              "domainLookupStart": 1309,
              "domainLookupStartCount": 0,
              "fetchStart": 1309,
              "fetchStartCount": 0,
              "redirect": 0,
              "redirectCount": 0,
              "redirectEnd": 0,
              "redirectStart": 0,
              "redirectStartCount": 0,
              "requestStart": 1310,
              "requestStartCount": 0,
              "response": 0,
              "responseCount": 0,
              "responseEnd": 1311,
              "responseStart": 1311,
              "responseStartCount": 0,
              "secureConnectionStart": 1309,
              "secureConnectionStartCount": 0
            },
            "cache": {},
            "connection": "-1",
            "pageref": "page_1",
            "request": {
              "bodySize": 0,
              "cookies": [],
              "headers": [],
              "headersSize": 0,
              "httpVersion": "HTTP/1.1",
              "method": "GET",
              "queryString": [
                {
                  "name": "family",
                  "value": "Roboto:400,500"
                }
              ],
              "url": "https://fonts.googleapis.com/css?family=Roboto:400,500"
            },
            "response": {
              "bodySize": 0,
              "content": {
                "compression": -1,
                "mimeType": "text/plain",
                "size": -1,
                "text": ""
              },
              "cookies": [],
              "decodedBodySize": 4000,
              "encodedBodySize": 590,
              "headers": [],
              "headersSize": 0,
              "httpVersion": "HTTP/1.1",
              "nextHopProtocol": "h2",
              "redirectURL": "",
              "status": "200",
              "statusText": "OK",
              "transferSize": 0
            },
            "serverIPAddress": "127.0.0.1",
            "serverTimings": null,
            "startedDateTime": "9331-02-04T04:30:01.309-06:00",
            "startedTimeInMillis": 0,
            "time": 2,
            "timings": {
              "blocked": 0,
              "connect": 0,
              "dns": 0,
              "receive": 0,
              "send": -1,
              "ssl": 0,
              "wait": 0
            }
          },
          {
            "_timings": {
              "connectEnd": 1310,
              "connection": 0,
              "connectionCount": 0,
              "connectionStartCount": 0,
              "connectStart": 1310,
              "count": 0,
              "domainLookup": 0,
              "domainLookupCount": 0,
              "domainLookupEnd": 1310,
              "domainLookupStart": 1310,
              "domainLookupStartCount": 0,
              "fetchStart": 1310,
              "fetchStartCount": 0,
              "redirect": 0,
              "redirectCount": 0,
              "redirectEnd": 0,
              "redirectStart": 0,
              "redirectStartCount": 0,
              "requestStart": 1311,
              "requestStartCount": 0,
              "response": 0,
              "responseCount": 0,
              "responseEnd": 1314,
              "responseStart": 1312,
              "responseStartCount": 0,
              "secureConnectionStart": 1310,
              "secureConnectionStartCount": 0
            },
            "cache": {},
            "connection": "-1",
            "pageref": "page_1",
            "request": {
              "bodySize": 0,
              "cookies": [],
              "headers": [],
              "headersSize": 0,
              "httpVersion": "HTTP/1.1",
              "method": "GET",
              "queryString": [
                {
                  "name": "family",
                  "value": "Material Icons"
                }
              ],
              "url": "https://fonts.googleapis.com/icon?family=Material Icons"
            },
            "response": {
              "bodySize": 0,
              "content": {
                "compression": -1,
                "mimeType": "text/plain",
                "size": -1,
                "text": ""
              },
              "cookies": [],
              "decodedBodySize": 568,
              "encodedBodySize": 338,
              "headers": [],
              "headersSize": 0,
              "httpVersion": "HTTP/1.1",
              "nextHopProtocol": "h2",
              "redirectURL": "",
              "status": "200",
              "statusText": "OK",
              "transferSize": 0
            },
            "serverIPAddress": "127.0.0.1",
            "serverTimings": null,
            "startedDateTime": "9331-02-04T04:30:01.310-06:00",
            "startedTimeInMillis": 0,
            "time": 3,
            "timings": {
              "blocked": 0,
              "connect": 0,
              "dns": 0,
              "receive": 1,
              "send": -1,
              "ssl": 0,
              "wait": 0
            }
          },
          {
            "_timings": {
              "connectEnd": 2105,
              "connection": 0,
              "connectionCount": 0,
              "connectionStartCount": 0,
              "connectStart": 2105,
              "count": 0,
              "domainLookup": 0,
              "domainLookupCount": 0,
              "domainLookupEnd": 2105,
              "domainLookupStart": 2105,
              "domainLookupStartCount": 0,
              "fetchStart": 2105,
              "fetchStartCount": 0,
              "redirect": 0,
              "redirectCount": 0,
              "redirectEnd": 2103,
              "redirectStart": 1394,
              "redirectStartCount": 0,
              "requestStart": 2105,
              "requestStartCount": 0,
              "response": 0,
              "responseCount": 0,
              "responseEnd": 2288,
              "responseStart": 2274,
              "responseStartCount": 0,
              "secureConnectionStart": 2105,
              "secureConnectionStartCount": 0
            },
            "cache": {},
            "connection": "-1",
            "pageref": "page_1",
            "request": {
              "bodySize": 0,
              "cookies": [],
              "headers": [],
              "headersSize": 0,
              "httpVersion": "HTTP/1.1",
              "method": "GET",
              "queryString": [],
              "url": "https://10.20.0.65:8443/ProductUI/#NVURL"
            },
            "response": {
              "bodySize": 0,
              "content": {
                "compression": -1,
                "mimeType": "text/plain",
                "size": -1,
                "text": ""
              },
              "cookies": [],
              "decodedBodySize": 10834,
              "encodedBodySize": 10834,
              "headers": [],
              "headersSize": 0,
              "httpVersion": "HTTP/1.1",
              "nextHopProtocol": "http/1.1",
              "redirectURL": "",
              "status": "200",
              "statusText": "OK",
              "transferSize": 11458
            },
            "serverIPAddress": "127.0.0.1",
            "serverTimings": null,
            "startedDateTime": "9331-02-04T04:30:01.394-06:00",
            "startedTimeInMillis": 0,
            "time": 894,
            "timings": {
              "blocked": 1,
              "connect": 0,
              "dns": 0,
              "receive": 14,
              "send": -1,
              "ssl": 0,
              "wait": 168
            }
          },
          {
            "_timings": {
              "connectEnd": 4791,
              "connection": 0,
              "connectionCount": 0,
              "connectionStartCount": 0,
              "connectStart": 4791,
              "count": 0,
              "domainLookup": 0,
              "domainLookupCount": 0,
              "domainLookupEnd": 4791,
              "domainLookupStart": 4791,
              "domainLookupStartCount": 0,
              "fetchStart": 4791,
              "fetchStartCount": 0,
              "redirect": 0,
              "redirectCount": 0,
              "redirectEnd": 0,
              "redirectStart": 0,
              "redirectStartCount": 0,
              "requestStart": 4793,
              "requestStartCount": 0,
              "response": 0,
              "responseCount": 0,
              "responseEnd": 4925,
              "responseStart": 4924,
              "responseStartCount": 0,
              "secureConnectionStart": 4791,
              "secureConnectionStartCount": 0
            },
            "cache": {},
            "connection": "-1",
            "pageref": "page_1",
            "request": {
              "bodySize": 0,
              "cookies": [],
              "headers": [],
              "headersSize": 0,
              "httpVersion": "HTTP/1.1",
              "method": "GET",
              "queryString": [],
              "url": "https://10.20.0.65:8443/netstorm/v1/cavisson/netdiagnostics/webddr/guiCancelationTimeOut"
            },
            "response": {
              "bodySize": 0,
              "content": {
                "compression": -1,
                "mimeType": "text/plain",
                "size": -1,
                "text": ""
              },
              "cookies": [],
              "decodedBodySize": 6,
              "encodedBodySize": 6,
              "headers": [],
              "headersSize": 0,
              "httpVersion": "HTTP/1.1",
              "nextHopProtocol": "http/1.1",
              "redirectURL": "",
              "status": "200",
              "statusText": "OK",
              "transferSize": 228
            },
            "serverIPAddress": "127.0.0.1",
            "serverTimings": null,
            "startedDateTime": "9331-02-04T04:30:04.791-06:00",
            "startedTimeInMillis": 0,
            "time": 133,
            "timings": {
              "blocked": 0,
              "connect": 0,
              "dns": 0,
              "receive": 0,
              "send": -1,
              "ssl": 0,
              "wait": 131
            }
          },
          {
            "_timings": {
              "connectEnd": 4792,
              "connection": 0,
              "connectionCount": 0,
              "connectionStartCount": 0,
              "connectStart": 4792,
              "count": 0,
              "domainLookup": 0,
              "domainLookupCount": 0,
              "domainLookupEnd": 4792,
              "domainLookupStart": 4792,
              "domainLookupStartCount": 0,
              "fetchStart": 4792,
              "fetchStartCount": 0,
              "redirect": 0,
              "redirectCount": 0,
              "redirectEnd": 0,
              "redirectStart": 0,
              "redirectStartCount": 0,
              "requestStart": 4795,
              "requestStartCount": 0,
              "response": 0,
              "responseCount": 0,
              "responseEnd": 4921,
              "responseStart": 4920,
              "responseStartCount": 0,
              "secureConnectionStart": 4792,
              "secureConnectionStartCount": 0
            },
            "cache": {},
            "connection": "-1",
            "pageref": "page_1",
            "request": {
              "bodySize": 0,
              "cookies": [],
              "headers": [],
              "headersSize": 0,
              "httpVersion": "HTTP/1.1",
              "method": "GET",
              "queryString": [],
              "url": "https://10.20.0.65:8443/ProductUI/resources/netforest/config.json"
            },
            "response": {
              "bodySize": 0,
              "content": {
                "compression": -1,
                "mimeType": "text/plain",
                "size": -1,
                "text": ""
              },
              "cookies": [],
              "decodedBodySize": 336,
              "encodedBodySize": 336,
              "headers": [],
              "headersSize": 0,
              "httpVersion": "HTTP/1.1",
              "nextHopProtocol": "http/1.1",
              "redirectURL": "",
              "status": "200",
              "statusText": "OK",
              "transferSize": 663
            },
            "serverIPAddress": "127.0.0.1",
            "serverTimings": null,
            "startedDateTime": "9331-02-04T04:30:04.792-06:00",
            "startedTimeInMillis": 0,
            "time": 128,
            "timings": {
              "blocked": 0,
              "connect": 0,
              "dns": 0,
              "receive": 0,
              "send": -1,
              "ssl": 0,
              "wait": 125
            }
          },
          {
            "_timings": {
              "connectEnd": 4995,
              "connection": 0,
              "connectionCount": 0,
              "connectionStartCount": 0,
              "connectStart": 4995,
              "count": 0,
              "domainLookup": 0,
              "domainLookupCount": 0,
              "domainLookupEnd": 4995,
              "domainLookupStart": 4995,
              "domainLookupStartCount": 0,
              "fetchStart": 4995,
              "fetchStartCount": 0,
              "redirect": 0,
              "redirectCount": 0,
              "redirectEnd": 0,
              "redirectStart": 0,
              "redirectStartCount": 0,
              "requestStart": 4999,
              "requestStartCount": 0,
              "response": 0,
              "responseCount": 0,
              "responseEnd": 5186,
              "responseStart": 5096,
              "responseStartCount": 0,
              "secureConnectionStart": 4995,
              "secureConnectionStartCount": 0
            },
            "cache": {},
            "connection": "-1",
            "pageref": "page_1",
            "request": {
              "bodySize": 0,
              "cookies": [],
              "headers": [],
              "headersSize": 0,
              "httpVersion": "HTTP/1.1",
              "method": "GET",
              "queryString": [],
              "url": "https://10.20.0.65:8443/ProductUI/resources/themes/theme1/theme.css"
            },
            "response": {
              "bodySize": 0,
              "content": {
                "compression": -1,
                "mimeType": "text/css",
                "size": -1,
                "text": ""
              },
              "cookies": [],
              "decodedBodySize": 236756,
              "encodedBodySize": 34296,
              "headers": [],
              "headersSize": 0,
              "httpVersion": "HTTP/1.1",
              "nextHopProtocol": "http/1.1",
              "redirectURL": "",
              "status": "200",
              "statusText": "OK",
              "transferSize": 35157
            },
            "serverIPAddress": "127.0.0.1",
            "serverTimings": null,
            "startedDateTime": "9331-02-04T04:30:04.995-06:00",
            "startedTimeInMillis": 0,
            "time": 191,
            "timings": {
              "blocked": 0,
              "connect": 0,
              "dns": 0,
              "receive": 90,
              "send": -1,
              "ssl": 0,
              "wait": 97
            }
          },
          {
            "_timings": {
              "connectEnd": 5004,
              "connection": 0,
              "connectionCount": 0,
              "connectionStartCount": 0,
              "connectStart": 5004,
              "count": 0,
              "domainLookup": 0,
              "domainLookupCount": 0,
              "domainLookupEnd": 5004,
              "domainLookupStart": 5004,
              "domainLookupStartCount": 0,
              "fetchStart": 5004,
              "fetchStartCount": 0,
              "redirect": 0,
              "redirectCount": 0,
              "redirectEnd": 0,
              "redirectStart": 0,
              "redirectStartCount": 0,
              "requestStart": 5011,
              "requestStartCount": 0,
              "response": 0,
              "responseCount": 0,
              "responseEnd": 5112,
              "responseStart": 5111,
              "responseStartCount": 0,
              "secureConnectionStart": 5004,
              "secureConnectionStartCount": 0
            },
            "cache": {},
            "connection": "-1",
            "pageref": "page_1",
            "request": {
              "bodySize": 0,
              "cookies": [],
              "headers": [],
              "headersSize": 0,
              "httpVersion": "HTTP/1.1",
              "method": "GET",
              "queryString": [
                {
                  "name": "_",
                  "value": "1619441329386"
                }
              ],
              "url": "https://10.20.0.65:8443/ProductUI/resources/themes/theme1/highchart-colors.js?_=1619441329386"
            },
            "response": {
              "bodySize": 0,
              "content": {
                "compression": -1,
                "mimeType": "text/javascript",
                "size": -1,
                "text": ""
              },
              "cookies": [],
              "decodedBodySize": 2823,
              "encodedBodySize": 2823,
              "headers": [],
              "headersSize": 0,
              "httpVersion": "HTTP/1.1",
              "nextHopProtocol": "http/1.1",
              "redirectURL": "",
              "status": "200",
              "statusText": "OK",
              "transferSize": 3158
            },
            "serverIPAddress": "127.0.0.1",
            "serverTimings": null,
            "startedDateTime": "9331-02-04T04:30:05.004-06:00",
            "startedTimeInMillis": 0,
            "time": 107,
            "timings": {
              "blocked": 0,
              "connect": 0,
              "dns": 0,
              "receive": 0,
              "send": -1,
              "ssl": 0,
              "wait": 99
            }
          },
          {
            "_timings": {
              "connectEnd": 5011,
              "connection": 0,
              "connectionCount": 0,
              "connectionStartCount": 0,
              "connectStart": 5011,
              "count": 0,
              "domainLookup": 0,
              "domainLookupCount": 0,
              "domainLookupEnd": 5011,
              "domainLookupStart": 5011,
              "domainLookupStartCount": 0,
              "fetchStart": 5011,
              "fetchStartCount": 0,
              "redirect": 0,
              "redirectCount": 0,
              "redirectEnd": 0,
              "redirectStart": 0,
              "redirectStartCount": 0,
              "requestStart": 5015,
              "requestStartCount": 0,
              "response": 0,
              "responseCount": 0,
              "responseEnd": 5158,
              "responseStart": 5158,
              "responseStartCount": 0,
              "secureConnectionStart": 5011,
              "secureConnectionStartCount": 0
            },
            "cache": {},
            "connection": "-1",
            "pageref": "page_1",
            "request": {
              "bodySize": 0,
              "cookies": [],
              "headers": [],
              "headersSize": 0,
              "httpVersion": "HTTP/1.1",
              "method": "GET",
              "queryString": [
                {
                  "name": "productKey",
                  "value": "null"
                }
              ],
              "url": "https://10.20.0.65:8443/ProductUI/productSummary/SummaryWebService/getProductName?productKey=null"
            },
            "response": {
              "bodySize": 0,
              "content": {
                "compression": -1,
                "mimeType": "text/plain",
                "size": -1,
                "text": ""
              },
              "cookies": [],
              "decodedBodySize": 591,
              "encodedBodySize": 446,
              "headers": [],
              "headersSize": 0,
              "httpVersion": "HTTP/1.1",
              "nextHopProtocol": "http/1.1",
              "redirectURL": "",
              "status": "200",
              "statusText": "OK",
              "transferSize": 700
            },
            "serverIPAddress": "127.0.0.1",
            "serverTimings": null,
            "startedDateTime": "9331-02-04T04:30:05.011-06:00",
            "startedTimeInMillis": 0,
            "time": 147,
            "timings": {
              "blocked": 0,
              "connect": 0,
              "dns": 0,
              "receive": 0,
              "send": -1,
              "ssl": 0,
              "wait": 143
            }
          },
          {
            "_timings": {
              "connectEnd": 5014,
              "connection": 0,
              "connectionCount": 0,
              "connectionStartCount": 0,
              "connectStart": 5014,
              "count": 0,
              "domainLookup": 0,
              "domainLookupCount": 0,
              "domainLookupEnd": 5014,
              "domainLookupStart": 5014,
              "domainLookupStartCount": 0,
              "fetchStart": 5014,
              "fetchStartCount": 0,
              "redirect": 0,
              "redirectCount": 0,
              "redirectEnd": 0,
              "redirectStart": 0,
              "redirectStartCount": 0,
              "requestStart": 5017,
              "requestStartCount": 0,
              "response": 0,
              "responseCount": 0,
              "responseEnd": 5147,
              "responseStart": 5147,
              "responseStartCount": 0,
              "secureConnectionStart": 5014,
              "secureConnectionStartCount": 0
            },
            "cache": {},
            "connection": "-1",
            "pageref": "page_1",
            "request": {
              "bodySize": 0,
              "cookies": [],
              "headers": [],
              "headersSize": 0,
              "httpVersion": "HTTP/1.1",
              "method": "GET",
              "queryString": [
                {
                  "name": "productKey",
                  "value": "null"
                }
              ],
              "url": "https://10.20.0.65:8443/ProductUI/productSummary/SummaryWebService/getRefreshIntervalTime?productKey=null"
            },
            "response": {
              "bodySize": 0,
              "content": {
                "compression": -1,
                "mimeType": "text/plain",
                "size": -1,
                "text": ""
              },
              "cookies": [],
              "decodedBodySize": 216,
              "encodedBodySize": 104,
              "headers": [],
              "headersSize": 0,
              "httpVersion": "HTTP/1.1",
              "nextHopProtocol": "http/1.1",
              "redirectURL": "",
              "status": "200",
              "statusText": "OK",
              "transferSize": 358
            },
            "serverIPAddress": "127.0.0.1",
            "serverTimings": null,
            "startedDateTime": "9331-02-04T04:30:05.014-06:00",
            "startedTimeInMillis": 0,
            "time": 132,
            "timings": {
              "blocked": 0,
              "connect": 0,
              "dns": 0,
              "receive": 0,
              "send": -1,
              "ssl": 0,
              "wait": 129
            }
          },
          {
            "_timings": {
              "connectEnd": 5196,
              "connection": 0,
              "connectionCount": 0,
              "connectionStartCount": 0,
              "connectStart": 5196,
              "count": 0,
              "domainLookup": 0,
              "domainLookupCount": 0,
              "domainLookupEnd": 5196,
              "domainLookupStart": 5196,
              "domainLookupStartCount": 0,
              "fetchStart": 5196,
              "fetchStartCount": 0,
              "redirect": 0,
              "redirectCount": 0,
              "redirectEnd": 0,
              "redirectStart": 0,
              "redirectStartCount": 0,
              "requestStart": 5198,
              "requestStartCount": 0,
              "response": 0,
              "responseCount": 0,
              "responseEnd": 5383,
              "responseStart": 5276,
              "responseStartCount": 0,
              "secureConnectionStart": 5196,
              "secureConnectionStartCount": 0
            },
            "cache": {},
            "connection": "-1",
            "pageref": "page_1",
            "request": {
              "bodySize": 0,
              "cookies": [],
              "headers": [],
              "headersSize": 0,
              "httpVersion": "HTTP/1.1",
              "method": "GET",
              "queryString": [],
              "url": "https://10.20.0.65:8443/ProductUI/images/logo_circle.png"
            },
            "response": {
              "bodySize": 0,
              "content": {
                "compression": -1,
                "mimeType": "image/png",
                "size": -1,
                "text": ""
              },
              "cookies": [],
              "decodedBodySize": 103933,
              "encodedBodySize": 96040,
              "headers": [],
              "headersSize": 0,
              "httpVersion": "HTTP/1.1",
              "nextHopProtocol": "http/1.1",
              "redirectURL": "",
              "status": "200",
              "statusText": "OK",
              "transferSize": 97759
            },
            "serverIPAddress": "127.0.0.1",
            "serverTimings": null,
            "startedDateTime": "9331-02-04T04:30:05.196-06:00",
            "startedTimeInMillis": 0,
            "time": 187,
            "timings": {
              "blocked": 0,
              "connect": 0,
              "dns": 0,
              "receive": 106,
              "send": -1,
              "ssl": 0,
              "wait": 78
            }
          },
          {
            "_timings": {
              "connectEnd": 5197,
              "connection": 0,
              "connectionCount": 0,
              "connectionStartCount": 0,
              "connectStart": 5197,
              "count": 0,
              "domainLookup": 0,
              "domainLookupCount": 0,
              "domainLookupEnd": 5197,
              "domainLookupStart": 5197,
              "domainLookupStartCount": 0,
              "fetchStart": 5197,
              "fetchStartCount": 0,
              "redirect": 0,
              "redirectCount": 0,
              "redirectEnd": 0,
              "redirectStart": 0,
              "redirectStartCount": 0,
              "requestStart": 5201,
              "requestStartCount": 0,
              "response": 0,
              "responseCount": 0,
              "responseEnd": 5290,
              "responseStart": 5288,
              "responseStartCount": 0,
              "secureConnectionStart": 5197,
              "secureConnectionStartCount": 0
            },
            "cache": {},
            "connection": "-1",
            "pageref": "page_1",
            "request": {
              "bodySize": 0,
              "cookies": [],
              "headers": [],
              "headersSize": 0,
              "httpVersion": "HTTP/1.1",
              "method": "GET",
              "queryString": [],
              "url": "https://10.20.0.65:8443/ProductUI/images/netvision.png"
            },
            "response": {
              "bodySize": 0,
              "content": {
                "compression": -1,
                "mimeType": "image/png",
                "size": -1,
                "text": ""
              },
              "cookies": [],
              "decodedBodySize": 8574,
              "encodedBodySize": 8574,
              "headers": [],
              "headersSize": 0,
              "httpVersion": "HTTP/1.1",
              "nextHopProtocol": "http/1.1",
              "redirectURL": "",
              "status": "200",
              "statusText": "OK",
              "transferSize": 8896
            },
            "serverIPAddress": "127.0.0.1",
            "serverTimings": null,
            "startedDateTime": "9331-02-04T04:30:05.197-06:00",
            "startedTimeInMillis": 0,
            "time": 92,
            "timings": {
              "blocked": 0,
              "connect": 0,
              "dns": 0,
              "receive": 2,
              "send": -1,
              "ssl": 0,
              "wait": 86
            }
          },
          {
            "_timings": {
              "connectEnd": 5228,
              "connection": 0,
              "connectionCount": 0,
              "connectionStartCount": 0,
              "connectStart": 5228,
              "count": 0,
              "domainLookup": 0,
              "domainLookupCount": 0,
              "domainLookupEnd": 5228,
              "domainLookupStart": 5228,
              "domainLookupStartCount": 0,
              "fetchStart": 5228,
              "fetchStartCount": 0,
              "redirect": 0,
              "redirectCount": 0,
              "redirectEnd": 0,
              "redirectStart": 0,
              "redirectStartCount": 0,
              "requestStart": 5261,
              "requestStartCount": 0,
              "response": 0,
              "responseCount": 0,
              "responseEnd": 5570,
              "responseStart": 5354,
              "responseStartCount": 0,
              "secureConnectionStart": 5228,
              "secureConnectionStartCount": 0
            },
            "cache": {},
            "connection": "-1",
            "pageref": "page_1",
            "request": {
              "bodySize": 0,
              "cookies": [],
              "headers": [],
              "headersSize": 0,
              "httpVersion": "HTTP/1.1",
              "method": "GET",
              "queryString": [
                {
                  "name": "v",
                  "value": "4.7.0"
                }
              ],
              "url": "https://10.20.0.65:8443/ProductUI/fontawesome-webfont.af7ae505a9eed503f8b8.woff2?v=4.7.0"
            },
            "response": {
              "bodySize": 0,
              "content": {
                "compression": -1,
                "mimeType": "text/plain",
                "size": -1,
                "text": ""
              },
              "cookies": [],
              "decodedBodySize": 77160,
              "encodedBodySize": 77160,
              "headers": [],
              "headersSize": 0,
              "httpVersion": "HTTP/1.1",
              "nextHopProtocol": "http/1.1",
              "redirectURL": "",
              "status": "200",
              "statusText": "OK",
              "transferSize": 77459
            },
            "serverIPAddress": "127.0.0.1",
            "serverTimings": null,
            "startedDateTime": "9331-02-04T04:30:05.228-06:00",
            "startedTimeInMillis": 0,
            "time": 342,
            "timings": {
              "blocked": 0,
              "connect": 0,
              "dns": 0,
              "receive": 215,
              "send": -1,
              "ssl": 0,
              "wait": 93
            }
          },
          {
            "_timings": {
              "connectEnd": 0,
              "connection": 0,
              "connectionCount": 0,
              "connectionStartCount": 0,
              "connectStart": 0,
              "count": 0,
              "domainLookup": 0,
              "domainLookupCount": 0,
              "domainLookupEnd": 0,
              "domainLookupStart": 0,
              "domainLookupStartCount": 0,
              "fetchStart": 5299,
              "fetchStartCount": 0,
              "redirect": 0,
              "redirectCount": 0,
              "redirectEnd": 0,
              "redirectStart": 0,
              "redirectStartCount": 0,
              "requestStart": 0,
              "requestStartCount": 0,
              "response": 0,
              "responseCount": 0,
              "responseEnd": 5594,
              "responseStart": 0,
              "responseStartCount": 0,
              "secureConnectionStart": 0,
              "secureConnectionStartCount": 0
            },
            "cache": {},
            "connection": "-1",
            "pageref": "page_1",
            "request": {
              "bodySize": 0,
              "cookies": [],
              "headers": [],
              "headersSize": 0,
              "httpVersion": "HTTP/1.1",
              "method": "GET",
              "queryString": [],
              "url": "https://10.20.0.65:8003/nv/ios/CheckEntry/config.js"
            },
            "response": {
              "bodySize": 0,
              "content": {
                "compression": -1,
                "mimeType": "text/javascript",
                "size": -1,
                "text": ""
              },
              "cookies": [],
              "decodedBodySize": 0,
              "encodedBodySize": 0,
              "headers": [],
              "headersSize": 0,
              "httpVersion": "HTTP/1.1",
              "nextHopProtocol": "http/1.1",
              "redirectURL": "",
              "status": "200",
              "statusText": "OK",
              "transferSize": 0
            },
            "serverIPAddress": "127.0.0.1",
            "serverTimings": null,
            "startedDateTime": "9331-02-04T04:30:05.299-06:00",
            "startedTimeInMillis": 0,
            "time": 295,
            "timings": {
              "blocked": -1,
              "connect": -1,
              "dns": -1,
              "receive": -1,
              "send": -1,
              "ssl": -1,
              "wait": -1
            }
          },
          {
            "_timings": {
              "connectEnd": 0,
              "connection": 0,
              "connectionCount": 0,
              "connectionStartCount": 0,
              "connectStart": 0,
              "count": 0,
              "domainLookup": 0,
              "domainLookupCount": 0,
              "domainLookupEnd": 0,
              "domainLookupStart": 0,
              "domainLookupStartCount": 0,
              "fetchStart": 4830,
              "fetchStartCount": 0,
              "redirect": 0,
              "redirectCount": 0,
              "redirectEnd": 0,
              "redirectStart": 0,
              "redirectStartCount": 0,
              "requestStart": 0,
              "requestStartCount": 0,
              "response": 0,
              "responseCount": 0,
              "responseEnd": 5240,
              "responseStart": 0,
              "responseStartCount": 0,
              "secureConnectionStart": 0,
              "secureConnectionStartCount": 0
            },
            "cache": {},
            "connection": "-1",
            "pageref": "page_1",
            "request": {
              "bodySize": 0,
              "cookies": [],
              "headers": [],
              "headersSize": 0,
              "httpVersion": "HTTP/1.1",
              "method": "GET",
              "queryString": [],
              "url": "https://10.20.0.65:8003/nv/kohls/cav_nv.js"
            },
            "response": {
              "bodySize": 0,
              "content": {
                "compression": -1,
                "mimeType": "text/javascript",
                "size": -1,
                "text": ""
              },
              "cookies": [],
              "decodedBodySize": 0,
              "encodedBodySize": 0,
              "headers": [],
              "headersSize": 0,
              "httpVersion": "HTTP/1.1",
              "nextHopProtocol": "http/1.1",
              "redirectURL": "",
              "status": "200",
              "statusText": "OK",
              "transferSize": 0
            },
            "serverIPAddress": "127.0.0.1",
            "serverTimings": null,
            "startedDateTime": "9331-02-04T04:30:04.830-06:00",
            "startedTimeInMillis": 0,
            "time": 410,
            "timings": {
              "blocked": -1,
              "connect": -1,
              "dns": -1,
              "receive": -1,
              "send": -1,
              "ssl": -1,
              "wait": -1
            }
          }
        ],
        "pages": [
          {
            "id": "page_1",
            "pageTimings": {
              "onContentLoad": 4796,
              "onLoad": 4843
            },
            "startedDateTime": "9331-02-04T04:30:00.000-06:00",
            "title": "Product"
          }
        ],
        "version": "1.1"
      }
    },
    "contentData": {
      "arrContentType": [
        "CSS",
        "Images",
        "Others",
        "Scripts"
      ],
      "arrRequest": [
        4,
        3,
        9,
        9
      ],
      "arrRequestPct": [
        "16.00",
        "12.00",
        "36.00",
        "36.00"
      ],
      "arrContentResponse": {
        "Others": {
          "time": 2365,
          "count": 9
        },
        "CSS": {
          "time": 1152,
          "count": 4
        },
        "Images": {
          "time": 2004,
          "count": 3
        },
        "Scripts": {
          "time": 10688,
          "count": 9
        }
      },
      "totalResponse": 16209
    },
    "pieData": [
      {
        "name": "CSS",
        "y": 7.11
      },
      {
        "name": "Images",
        "y": 12.36
      },
      {
        "name": "Others",
        "y": 14.59
      },
      {
        "name": "Scripts",
        "y": 65.94
      }
    ],
    "contentTableData": [
      {
        "ContentType": "CSS",
        "Request": 4,
        "RequestPct": 16,
        "AvgResponse": 288,
        "LoadDuration": 7.11
      },
      {
        "ContentType": "Images",
        "Request": 3,
        "RequestPct": 12,
        "AvgResponse": 668,
        "LoadDuration": 12.36
      },
      {
        "ContentType": "Others",
        "Request": 9,
        "RequestPct": 36,
        "AvgResponse": 262.78,
        "LoadDuration": 14.59
      },
      {
        "ContentType": "Scripts",
        "Request": 9,
        "RequestPct": 36,
        "AvgResponse": 1187.56,
        "LoadDuration": 65.94
      }
    ]
  }
};


export const PAGE = {
  "RESOURCE_TIMING_FLAG": 1,
  "PAGEDUMP_FLAG": 2,
  "OCX_INFO_MISSING_PAGE": 4,
  "OVERALL_INFO_MISSING_PAGE": 8,
  "navigationType": {
    "class": "fa fa-mouse-pointer",
    "title": "Navigation"
  },
  "cookies": [
    {
      "origName": "CavSF",
      "origValue": "cavnvComplete,,,,,,,,,,,1,,,,",
      "name": "CavSF",
      "value": "cavnvComplete,,,,,,,,,,,1,,,,",
      "nvCookie": true
    }
  ],
  "eventListData": "9",
  "flowpathinstances": "-1",
  "sid": "991737867405361152",
  "index": 1,
  "pageName": {
    "id": 3,
    "name": "Product"
  },
  "pagename": "Product",
  "events": [
    {
      "id": 9,
      "name": "JsError",
      "icon": "/eventIcons/jserror.png",
      "description": "JS Error Failure Event",
      "count": 2
    }
  ],
  "firstByteTime": 0.583,
  "timeToDOMComplete": 4.796,
  "timeToLoad": 4.843,
  "url": "https://10.20.0.65:8443/ProductUI/#/login",
  "terminalId": 0,
  "tabid": 0,
  "associatedId": -1,
  "percievedRenderTime": 4.796,
  "domInteractiveTime": 4.795,
  "redirectionCount": 4,
  "referrerUrl": "https://10.20.0.65:8443/",
  "replayFlag": true,
  "resourceTimingFlag": true,
  "ocxDataMissing": false,
  "overallDataMissing": true,
  "navigationStartTime": "12:49:21 04/26/21",
  "redirectionDuration": 0.479,
  "cacheLookupTime": 0.003,
  "dnsTime": 0,
  "connectionTime": 0,
  "secureConnectionTime": 0,
  "navigationTypeTime": 0,
  "responseTime": 0.001,
  "unloadTime": 0,
  "domTime": 4.243,
  "loadEventTime": 0.001,
  "pageInstance": 1,
  "serverresponsetime": 0.097,
  "bandWidth": 4.887,
  "bytesIn": 4083.854,
  "showbandWidth": "4.887 Mbps",
  "showbytesIn": "3.895 MB",
  "transactionid": null,
  "webviewFlag": true,
  "pageinstance": 1,
  "firstpaint": 1.531,
  "firstcontentpaint": 2.12,
  "firstinputdelay": 0.003,
  "timetointeractive": 4.8
};
