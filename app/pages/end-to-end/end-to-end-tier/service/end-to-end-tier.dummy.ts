import { EndToEndTierData } from './end-to-end-tier.model';

export const END_TO_END_TIER_DATA: EndToEndTierData = {
  allServers: [
    {
      servers: 'Active Logged In Users Monitor',
      value: '50%',
      severityColor: '#f8cccc',
    },
    {
      servers: 'Active Logged In Users Monitor',
      value: '25%',
      severityColor: '#ff1550',
    },
    {
      servers: 'Active Logged In Users Monitor',
      value: '75%',
      severityColor: '#484849',
    },
    {
      servers: 'Active Logged In Users Monitor',
      value: '76%',
      severityColor: '#484849',
    },
    {
      servers: 'Active Logged In Users Monitor',
      value: '25%',
      severityColor: '#ff1550',
    },
    {
      servers: 'Active Logged In Users Monitor',
      value: '50%',
      severityColor: '#f8cccc',
    },
    {
      servers: 'Active Logged In Users Monitor',
      value: '25%',
      severityColor: '#ff1550',
    },
    {
      servers: 'Active Logged In Users Monitor',
      value: '75%',
      severityColor: '#484849',
    },
    {
      servers: 'Active Logged In Users Monitor',
      value: '50%',
      severityColor: '#f8cccc',
    },
    {
      servers: 'Active Logged In Users Monitor',
      value: '25%',
      severityColor: '#ff1550',
    },

    {
      servers: 'Active Logged In Users Monitor',
      value: '25%',
      severityColor: '#ff1550',
    },
  ],
  instances: [
    {
      instances: 'Instance1',
      value: '76%',
      severityColor: '#484849',
      icon: 'icons8 icons8-filter',
    },
    {
      instances: 'Instance1',
      value: '25%',
      severityColor: '#ff1550',
      icon: 'icons8 icons8-search',
    },
    {
      instances: 'Instance1',
      value: '50%',
      severityColor: '#f8cccc',
      icon: 'icons8 icons8-filter',
    },
    {
      instances: 'Instance1',
      value: '76%',
      severityColor: '#484849',
      icon: 'icons8 icons8-filter',
    },
    {
      instances: 'Instance1',
      value: '25%',
      severityColor: '#ff1550',
      icon: 'icons8 icons8-filter',
    },
    {
      instances: 'Active Logged In Users Monitor',
      value: '50%',
      severityColor: '#f8cccc',
    },
    {
      instances: 'Active Logged In Users Monitor',
      value: '75%',
      severityColor: '#484849',
    },
    {
      instances: 'Active Logged In Users Monitor',
      value: '25%',
      severityColor: '#ff1550',
    },

    {
      instances: 'Active Logged In Users Monitor',
      value: '50%',
      severityColor: '#f8cccc',
    },
    {
      instances: 'Instance2',
      value: '50%',
      severityColor: '#f8cccc',
      icon: 'icons8 icons8-filter',
    },
    {
      instances: 'Instance1',
      value: '76%',
      severityColor: '#484849',
      icon: 'icons8 icons8-filter',
    },
    {
      instances: 'Active Logged In Users Monitor',
      value: '25%',
      severityColor: '#ff1550',
    },
  ],
  charts: [
    {
      title: 'All (Business Health)',
      highchart: {
        chart: {
          type: 'pie',
          height: 200,
        },
        title: null,
        tooltip: {
          pointFormat: '{series.name}: <b>{point.percentage:.1f}</b>',
        },
        legend: {
          enabled: true,
          align: 'left',
          verticalAlign: 'top',
          layout: 'vertical',
          x: 10,
          y: 40,
          symbolPadding: 10,
          symbolHeight: 12,
          symbolWidth: 12,
          symbolRadius: 0,
          itemStyle: {
            fontWeight: 'bold',
            textOverflow: 'ellipsis',
          },
          labelFormat: '{name}' + ': ' + '{y}',
        },
        plotOptions: {
          pie: {
            size: '100%',
            dataLabels: {
              enabled: false,
            },
            showInLegend: true,
            borderWidth: 1,
            borderColor: '#707070',
          },
        },
        series: [
          {
            type:'pie',
            name: 'Business Health',
            data: [
              {
                name: 'Critical',
                y: 23,
                marker: {
                  fillColor: '#F04943',
                  symbol: 'square',
                },
                color: '#F04943',
              },
              {
                name: 'Major',
                y: 15,
                marker: {
                  fillColor: '#F6B4B4',
                  symbol: 'square',
                },
                color: '#F6B4B4',
              },
              {
                name: 'Normal',
                y: 10,
                marker: {
                  fillColor: '#707070',
                  symbol: 'square',
                },
                color: '#707070',
              },
            ],
          },
        ]
      },
    },
    {
      title: 'Area Chart',
      highchart: {
        chart: {
          type: 'area',
          height: 200
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
            type:'area',
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
            type:'area',
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
        ],
      },
    },
  ]
  
};
