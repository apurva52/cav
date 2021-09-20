import { LogsData } from './logstab.model';

export const LOGS_DATA: LogsData = {
  charts: [
    {
      title: 'spline Chart',
      highchart: {
        chart: {
          type: 'spline',
          height: '150px',
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
          spline: {
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
          height: '150px',
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
  storeTier: [
    {
      label: 'LRM Maintenance',
      value: '',
    },
    {
      label: 'Cavisson Maintenance 2',
      value: '',
    },
    {
      label: 'LRM Maintenance',
      value: '',
    },
    {
      label: 'Cavisson Maintenance 2',
      value: '',
    },
    {
      label: 'LRM Maintenance',
      value: '',
    },
    {
      label: 'Cavisson Maintenance 2',
      value: '',
    },
    {
      label: 'LRM Maintenance',
      value: '',
    },
    {
      label: 'Cavisson Maintenance 2',
      value: '',
    },
  ],
  autocompleteData: [
    { name: 'All' },
    { name: 'Basic' },
    { name: 'View All Searches' },
    { name: 'index=* query=*' },
    { name: 'index=* maxdocs=10000 query=*' }
  ],
  timestamp:[],
  tabledata:[],
  fieldsdata:[],
  stats:[],
  pattern: [
    {
      label: 'Last 10 mins',
      value: 'Last 10 mins',
    },
    {
      label: 'Custom',
      value: 'Custom',
    },
  ],
  headers: [
    {
      cols: [
        // {
        //   label: '#',
        //   valueField: 'no',
        //   classes: 'text-left',
        //   width: '5%',
        // },
        {
          label: 'Time',
          valueField: 'Time',
          classes: 'text-left',
          width: '10%',
        },
        {
          label: 'Log Information',
          valueField: 'keyword',
          classes: 'text-left',
          badgeField: true,
          width: '70%',
        },
        {
          label: '',
          valueField: 'icon',
          classes: 'text-left',
          iconField: true,
          width: '15%',
        },
      ],
    },
  ],
  data: [ 
    {
      no: '#',
      time: '23:51:24 02/03/21',
      response:
        'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s',
      icon: '',
      responseBtns:
        [
          {
            label: 'tier: Tomcat4',
            color: 'bg-voilet',
          },
          {
            label: 'server: controller',
            color: 'bg-green',
          },
          {
            label: 'instance: Instance_1_1_1_1_1_1_1_1',
            color: 'bg-pink',
          },
          {
            label: '_index: Tomcat4',
            color: 'bg-yellow',
          },
          {
            label: 'message: Tomcat4',
            color: 'bg-yellow',
          }
        ],
    },
    {
      no: '#',
      time: '23:51:24 08/01/21',
      response:
        'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s',
      icon: '',
      responseBtns:
        [
          {
            label: 'tier: Tomcat4',
            color: 'bg-voilet',
          },
          {
            label: 'server: controller',
            color: 'bg-green',
          },
          // {
          //   label: 'instance: Instance_1_1_1_1_1_1_1_1',
          //   color: 'bg-pink',
          // },
          // {
          //   label: '_index: Tomcat4',
          //   color: 'bg-yellow',
          // },
          // {
          //   label: 'message: Tomcat4',
          //   color: 'bg-yellow',
          // }
        ],
    },
    {
      no: '#',
      time: '18:51:24 02/03/21',
      response:
        'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s',
      icon: '',
      responseBtns:
        [
          {
            label: 'tier: Tomcat4',
            color: 'bg-voilet',
          },
          {
            label: 'server: controller',
            color: 'bg-green',
          },
          // {
          //   label: 'instance: Instance_1_1_1_1_1_1_1_1',
          //   color: 'bg-pink',
          // },
          // {
          //   label: '_index: Tomcat4',
          //   color: 'bg-yellow',
          // },
          {
            label: 'message: Tomcat4',
            color: 'bg-yellow',
          }
        ],
    },
    {
      no: '#',
      time: '23:51:56 02/01/21',
      response:
        'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s',
      icon: '',
      responseBtns:
        [
          {
            label: 'tier: Tomcat4',
            color: 'bg-voilet',
          },
          // {
          //   label: 'server: controller',
          //   color: 'bg-green',
          // },
          // {
          //   label: 'instance: Instance_1_1_1_1_1_1_1_1',
          //   color: 'bg-pink',
          // },
          {
            label: '_index: Tomcat4',
            color: 'bg-yellow',
          },
          {
            label: 'message: Tomcat4',
            color: 'bg-yellow',
          }
        ],
    },
  ],

};
