import { ChartConfig } from './chart.model';

export const CHART_SAMPLE: ChartConfig[] = [
  {
    title: 'Pie Chart',
    highchart: {
      chart: {
        type: 'pie',
      },
      title: null,
      tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>',
      },
      plotOptions: {
        pie: {
          size: '70%',
          borderWidth: 0,
          dataLabels: {
            enabled: true,
            format: '<b>{point.percentage:.1f} %',
          },
        },
      },
      series: [
        {
          name: 'Brands',
          colorByPoint: true,
          data: [
            {
              name: 'Chrome',
              y: 61.41,
            },
            {
              name: 'Internet Explorer',
              y: 11.84,
            },
            {
              name: 'Firefox',
              y: 10.85,
            },
            {
              name: 'Edge',
              y: 4.67,
            },
            {
              name: 'Safari',
              y: 4.18,
            },
            {
              name: 'Sogou Explorer',
              y: 1.64,
            },
            {
              name: 'Opera',
              y: 1.6,
            },
            {
              name: 'QQ',
              y: 1.2,
            },
            {
              name: 'Other',
              y: 2.61,
            },
          ],
        },
      ] as Highcharts.SeriesOptionsType[],
    },
  },
  {
    title: 'Line Chart',
    highchart: {
      chart: {
        type: 'line',
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
          ],
        },
        {
          name: 'USSR/Russia',
          data: [
            null,
            null,
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
  {
    title: 'Bar Chart',
    highchart: {
      chart: {
        type: 'bar',
      },
      title: {
        text: null,
      },
      xAxis: {
        visible: false,
        title: {
          text: null,
        },
      },
      yAxis: {
        min: 0,
        title: {
          text: 'Population (millions)',
          align: 'high',
        },
        labels: {
          overflow: 'justify',
        },
      },
      tooltip: {
        valueSuffix: ' millions',
      },
      plotOptions: {
        bar: {
          dataLabels: {
            enabled: false,
          },
        },
      },
      legend: {
        enabled: false,
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'top',
        x: -40,
        y: 80,
        floating: true,
        borderWidth: 1,
        backgroundColor: '#FFFFFF',
        shadow: true,
      },
      credits: {
        enabled: false,
      },
      series: [
        {
          name: 'Year 1800',
          data: [107, 31, 635, 203, 2],
        },
        {
          name: 'Year 1900',
          data: [133, 156, 947, 408, 6],
        },
      ] as Highcharts.SeriesOptionsType[],
    },
  },
  {
    title: 'Column Chart',
    highchart: {
      chart: {
        type: 'column',
        height: 300
      },
      title: {
        text: null,
      },
      xAxis: {
        visible: false,
        title: {
          text: null,
        },
      },
      yAxis: {
        min: 0,
        title: {
          text: 'Population (millions)',
          align: 'high',
        },
        labels: {
          overflow: 'justify',
        },
      },
      tooltip: {
        valueSuffix: ' millions',
      },
      plotOptions: {
        bar: {
          dataLabels: {
            enabled: false,
          },
        },
      },
      legend: {
        enabled: false,
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'top',
        x: -40,
        y: 80,
        floating: true,
        borderWidth: 1,
        backgroundColor: '#FFFFFF',
        shadow: true,
      },
      credits: {
        enabled: false,
      },
      series: [
        {
          name: 'Year 1800',
          data: [107, 31, 635, 203, 2],
        },
        {
          name: 'Year 1900',
          data: [133, 156, 947, 408, 6],
        },
      ] as Highcharts.SeriesOptionsType[],
    },
  },
];
