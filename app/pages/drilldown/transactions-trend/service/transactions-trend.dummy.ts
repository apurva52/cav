import {
  TransactionTrendData,
  TransactionTrendTable,
} from './transactions-trend.model';

export const TRANSACTION_TREND_DATA: TransactionTrendData = {
  tableData: {
    search: {
      fields: ['transaction', 'bt', 'total', 'time', 'tps', 'errors', 'db'],
    },

    paginator: {
      first: 0,
      rows: 10,
      rowsPerPageOptions: [10, 20, 50],
    },

    headers: [
      {
        cols: [
          {
            label: 'Business Transaction',
            valueField: 'transaction',
            classes: 'text-left',
            selected: true,
            filter: {
              isFilter: true,
              type: 'contains',
            },
            isSort: true,
            severityColorField: true,
           // width:'20%'
          },
          {
            label: 'BT%',
            valueField: 'bt',
            classes: 'text-right',
            selected: true,
            filter: {
              isFilter: true,
              type: 'custom',
            },
            isSort: true,
           // width:'20%'
          },
          {
            label: 'Total',
            valueField: 'total',
            classes: 'text-right',
            selected: true,
            filter: {
              isFilter: true,
              type: 'custom',
            },
            isSort: true,
           // width:'20%'
          },
          {
            label: 'Response Time',
            valueField: 'time',
            classes: 'text-right',
            selected: true,
            filter: {
              isFilter: true,
              type: 'contains',
            },
            isSort: true,
           // width:'20%'
          },
          {
            label: 'TPS',
            valueField: 'tps',
            classes: 'text-right',
            selected: true,
            filter: {
              isFilter: true,
              type: 'custom',
            },
            isSort: true,
           // width:'10%'
          },
          {
            label: 'Errors / Sec',
            valueField: 'errors',
            classes: 'text-right',
            selected: true,
            filter: {
              isFilter: true,
              type: 'custom',
            },
            isSort: true,
           // width:'10%'
          },
          {
            label: 'DB Callouts',
            valueField: 'db',
            classes: 'text-right',
            selected: true,
            filter: {
              isFilter: true,
              type: 'custom',
            },
            isSort: true,
           // width:'10%'
          },
        
        ],
      },
    ],
    data: [
      {
        transaction: 'Dashboard Service / Req Dashboard Service / Req Dashboard Service / Req',
        bt: 20,
        total: 100.954,
        time: '1,063',
        tps: 20,
        errors: 0,
        db: 0,
        severityColor: '#89b0d3',
      },
      {
        transaction: 'data',
        bt: 50,
        total: 94.954,
        time: '1,063',
        tps: 13,
        errors: 4,
        db: 20,
        severityColor: '#89b0d3',
      },
      {
        transaction: 'Service / Req',
        bt: 10,
        total: 154.954,
        time: '1,063',
        tps: 30,
        errors: 0,
        db: 0,
        severityColor: '#89b0d3',
      },
      {
        transaction: 'Req / Dashboard Service',
        bt: 20,
        total: 254.954,
        time: '1,022',
        tps: 10,
        errors: 20,
        db: 30,
        severityColor: '#89b0d3',
      },
      ,
      {
        transaction: 'Req / Dashboard Service',
        bt: 20,
        total: 254.954,
        time: '1,022',
        tps: 10,
        errors: 20,
        db: 30,
        severityColor: '#89b0d3',
      }
      ,
      {
        transaction: 'Req / Dashboard Service',
        bt: 20,
        total: 254.954,
        time: '1,022',
        tps: 10,
        errors: 20,
        db: 30,
        severityColor: '#89b0d3',
      }
      ,
      {
        transaction: 'Req / Dashboard Service',
        bt: 20,
        total: 254.954,
        time: '1,022',
        tps: 10,
        errors: 20,
        db: 30,
        severityColor: '#89b0d3',
      }
      ,
      {
        transaction: 'Req / Dashboard Service',
        bt: 20,
        total: 254.954,
        time: '1,022',
        tps: 10,
        errors: 20,
        db: 30,
        severityColor: '#89b0d3',
      },
      {
        transaction: 'Req / Dashboard Service',
        bt: 20,
        total: 254.954,
        time: '1,022',
        tps: 10,
        errors: 20,
        db: 30,
        severityColor: '#89b0d3',
      },
      {
        transaction: 'Req / Dashboard Service',
        bt: 20,
        total: 254.954,
        time: '1,022',
        tps: 10,
        errors: 20,
        db: 30,
        severityColor: '#89b0d3',
      },
      {
        transaction: 'Req / Dashboard Service',
        bt: 20,
        total: 254.954,
        time: '1,022',
        tps: 10,
        errors: 20,
        db: 30,
        severityColor: '#89b0d3',
      }
    ],
    tableFilter: true,
    severityBgColorField: 'severityColor',
  },
  specifiedTime: {
    options: [
      {
        label: 'Live',
        items: [
          { label: 'Last 5 Minutes' },
          { label: 'Last 10 Minutes' },
          { label: 'Last 30 Minutes' },
          { label: 'Last 1 Hours' },
          { label: 'Last 2 Hours' },
          { label: 'Last 4 Hours' },
          { label: 'Last 6 Hours' },
          { label: 'Last 8 Hours' },
          { label: 'Last 12 Hours' },
          { label: 'Last 24 Hours' },
          { label: 'Today' },
          { label: 'Last 7 Days' },
          { label: 'Last 30 Days' },
          { label: 'Last 90 Days' },
          { label: 'This Week' },
          { label: 'This Month' },
          { label: 'This Year' },
        ],
      },
      {
        label: 'Past',
        items: [
          { label: 'Yesterday' },
          { label: 'Last Week' },
          { label: 'Last 2 Week' },
          { label: 'Last 3 Week' },
          { label: 'Last 4 Week' },
          { label: 'Last Month' },
          { label: 'Last 2 Month' },
          { label: 'Last 3 Month' },
          { label: 'Last 6 Month' },
          { label: 'Last Year' },
        ],
      },
      {
        label: 'Events',
        items: [
          {
            label: 'Black Friday',
            items: [
              { label: '2020' },
              { label: '2019' },
              { label: '2018' },
              { label: '2017' },
              { label: '2016' },
              { label: '2015' },
              { label: '2014' },
              { label: '2013' },
              { label: '2012' },
              { label: '2011' },
              { label: '2010' },
            ],
          },
          {
            label: 'Christmas Day',
            items: [
              { label: '2020' },
              { label: '2019' },
              { label: '2018' },
              { label: '2017' },
              { label: '2016' },
              { label: '2015' },
              { label: '2014' },
              { label: '2013' },
              { label: '2012' },
              { label: '2011' },
              { label: '2010' },
            ],
          },
          {
            label: 'Cyber Monday',
            items: [
              { label: '2020' },
              { label: '2019' },
              { label: '2018' },
              { label: '2017' },
              { label: '2016' },
              { label: '2015' },
              { label: '2014' },
              { label: '2013' },
              { label: '2012' },
              { label: '2011' },
              { label: '2010' },
            ],
          },
          {
            label: 'Good Friday',
            items: [
              { label: '2020' },
              { label: '2019' },
              { label: '2018' },
              { label: '2017' },
              { label: '2016' },
              { label: '2015' },
              { label: '2014' },
              { label: '2013' },
              { label: '2012' },
              { label: '2011' },
              { label: '2010' },
            ],
          },
          {
            label: 'New Years Day',
            items: [
              { label: '2020' },
              { label: '2019' },
              { label: '2018' },
              { label: '2017' },
              { label: '2016' },
              { label: '2015' },
              { label: '2014' },
              { label: '2013' },
              { label: '2012' },
              { label: '2011' },
              { label: '2010' },
            ],
          },
          {
            label: 'Presidents Day',
            items: [
              { label: '2020' },
              { label: '2019' },
              { label: '2018' },
              { label: '2017' },
              { label: '2016' },
              { label: '2015' },
              { label: '2014' },
              { label: '2013' },
              { label: '2012' },
              { label: '2011' },
              { label: '2010' },
            ],
          },
          {
            label: 'Thanks Giving Day',
            items: [
              { label: '2020' },
              { label: '2019' },
              { label: '2018' },
              { label: '2017' },
              { label: '2016' },
              { label: '2015' },
              { label: '2014' },
              { label: '2013' },
              { label: '2012' },
              { label: '2011' },
              { label: '2010' },
            ],
          },
          {
            label: 'Valentines Day',
            items: [
              { label: '2020' },
              { label: '2019' },
              { label: '2018' },
              { label: '2017' },
              { label: '2016' },
              { label: '2015' },
              { label: '2014' },
              { label: '2013' },
              { label: '2012' },
              { label: '2011' },
              { label: '2010' },
            ],
          },
        ],
      },
      {
        label: 'Custom',
        command: (event: any) => {},
      },
    ],
  },
  charts: [
    {
      title: 'Area Chart',
      highchart: {
        chart: {
          type: 'area',
        },

        title: {
          text: null,
        },
        legend: {
          enabled: false,
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
          area: {
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
            data: [
              null,
              null,
              null,
              null,
              null,
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
              15468,
              20434,
              24126,
              27387,
              29459,
              31056,
              31982,
              32040,
              31233,
              29224,
              27342,
              26662,
              26956,
              27912,
              28999,
              28965,
              27826,
              25579,
              25722,
              24826,
              24605,
              24304,
              23464,
              23708,
              24099,
              24357,
              24237,
              24401,
              24344,
              23586,
              22380,
              21004,
              17287,
              14747,
              13076,
              12555,
              12144,
              11009,
              10950,
              10871,
              10824,
              10577,
              10527,
              10475,
              10421,
              10358,
              10295,
              10104,
              9914,
              9620,
              9326,
              5113,
              5113,
              4954,
              4804,
              4761,
              4717,
              4368,
              4018,
            ],
          },
          {
            name: 'USSR/Russia',
            data: [
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              5,
              25,
              50,
              120,
              150,
              200,
              426,
              660,
              869,
              1060,
              1605,
              2471,
              3322,
              4238,
              5221,
              6129,
              7089,
              8339,
              9399,
              10538,
              11643,
              13092,
              14478,
              15915,
              17385,
              19055,
              21205,
              23044,
              25393,
              27935,
              30062,
              32049,
              33952,
              35804,
              37431,
              39197,
              45000,
              43000,
              41000,
              39000,
              37000,
              35000,
              33000,
              31000,
              29000,
              27000,
              25000,
              24000,
              23000,
              22000,
              21000,
              20000,
              19000,
              18000,
              18000,
              17000,
              16000,
              15537,
              14162,
              12787,
              12600,
              11400,
              5500,
              4512,
              4502,
              4502,
              4500,
              4500,
            ],
          },
        ] as Highcharts.SeriesOptionsType[],
      },
    },
    {
      title: 'Area Chart',
      highchart: {
        chart: {
          type: 'area',
        },

        title: {
          text: null,
        },
        legend: {
          enabled: false,
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
          area: {
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
            data: [
              null,
              null,
              null,
              null,
              null,
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
              15468,
              20434,
              24126,
              27387,
              29459,
              31056,
              31982,
              32040,
              31233,
              29224,
              27342,
              26662,
              26956,
              27912,
              28999,
              28965,
              27826,
              25579,
              25722,
              24826,
              24605,
              24304,
              23464,
              23708,
              24099,
              24357,
              24237,
              24401,
              24344,
              23586,
              22380,
              21004,
              17287,
              14747,
              13076,
              12555,
              12144,
              11009,
              10950,
              10871,
              10824,
              10577,
              10527,
              10475,
              10421,
              10358,
              10295,
              10104,
              9914,
              9620,
              9326,
              5113,
              5113,
              4954,
              4804,
              4761,
              4717,
              4368,
              4018,
            ],
          },
          {
            name: 'USSR/Russia',
            data: [
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              5,
              25,
              50,
              120,
              150,
              200,
              426,
              660,
              869,
              1060,
              1605,
              2471,
              3322,
              4238,
              5221,
              6129,
              7089,
              8339,
              9399,
              10538,
              11643,
              13092,
              14478,
              15915,
              17385,
              19055,
              21205,
              23044,
              25393,
              27935,
              30062,
              32049,
              33952,
              35804,
              37431,
              39197,
              45000,
              43000,
              41000,
              39000,
              37000,
              35000,
              33000,
              31000,
              29000,
              27000,
              25000,
              24000,
              23000,
              22000,
              21000,
              20000,
              19000,
              18000,
              18000,
              17000,
              16000,
              15537,
              14162,
              12787,
              12600,
              11400,
              5500,
              4512,
              4502,
              4502,
              4500,
              4500,
            ],
          },
        ] as Highcharts.SeriesOptionsType[],
      },
    },
  ],
};
