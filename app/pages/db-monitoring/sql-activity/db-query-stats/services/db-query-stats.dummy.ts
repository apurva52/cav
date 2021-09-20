import { blockingSessionTable } from './blocking-session.model';


export const BLOCKING_SESSION_TABLE: blockingSessionTable = {
  charts: [
    {
      title: 'Graphical Representation of Blocked Process',
      highchart: {
        chart: {
          height: '200px',
        },
        title: {
          text: null,
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
            text: 'Average Wait Time(ms)',
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
        series: [{
          name: 'Installation',
          data: [43934, 52503, 57177, 69658, 97031, 119931, 137133, 154175]
        }, {
          name: 'Other',
          data: [12908, 5948, 8105, 11248, 8989, 11816, 18274, 18111]
        }] as Highcharts.SeriesOptionsType[],
      },
    },
  ],

  paginator: {
    first: 1,
    rows: 10,
    rowsPerPageOptions: [10, 20, 30, 50, 100],
  },

  headers: [
    {
      cols: [
        {
          label: 'Profile Name',
          valueField: 'profileName',
          classes: 'text-left',
          selected: true,
          filter: {
            isFilter: true,
            type: 'contains',
          },
          isSort: true,
        },
        {
          label: 'Project Description',
          valueField: 'proDescription',
          classes: 'text-left',
          selected: true,
          filter: {
            isFilter: true,
            type: 'contains',
          },
          isSort: true,
        },
        {
          label: 'Check Rules',
          valueField: 'checkRules',
          classes: 'text-center',
          selected: true,
          filter: {
            isFilter: true,
            type: 'contains',
          },
          isSort: true,
        },
        {
          label: 'Last Updated',
          valueField: 'LastUpdated',
          classes: 'text-center',
          selected: true,
          filter: {
            isFilter: true,
            type: 'contains',
          },
          isSort: true,
          width: '20%',
        },
        {
          label: 'Updated By',
          valueField: 'updatedBy',
          classes: 'text-center',
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
      data: {
        profileName: '2',
        proDescription: '184.104.0.0',
        checkRules: '16',
        LastUpdated: '184.105.0.0',
        updatedBy: '184.105.0.0',
      },
      children: [
        {
          data: {
            profileName: '2',
            proDescription: '184.104.0.0',
            checkRules: '16',
            LastUpdated: '184.105.0.0',
            updatedBy: '184.105.0.0',
          },
        },
      ],
    },
    {
      data: {
        profileName: '2',
        proDescription: '184.104.0.0',
        checkRules: '16',
        LastUpdated: '184.105.0.0',
        updatedBy: '184.105.0.0',
      },
    },
    {
      data: {
        profileName: '2',
        proDescription: '184.104.0.0',
        checkRules: '16',
        LastUpdated: '184.105.0.0',
        updatedBy: '184.105.0.0',
      },
    },
    {
      data: {
        profileName: '2',
        proDescription: '184.104.0.0',
        checkRules: '16',
        LastUpdated: '184.105.0.0',
        updatedBy: '184.105.0.0',
      },
    },
    {
      data: {
        profileName: '2',
        proDescription: '184.104.0.0',
        checkRules: '16',
        LastUpdated: '184.105.0.0',
        updatedBy: '184.105.0.0',
      },
    },
  ],

  tableFilter: true,

};
