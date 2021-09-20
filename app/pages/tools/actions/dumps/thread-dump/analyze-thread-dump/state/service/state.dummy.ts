import { StateData } from './state.model';

export const STATE_DATA: StateData = {
  chartData: {
    title: 'Stats',
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
      credits:{
            enabled:false
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
  tableData: {
    paginator: {
      first: 0,
      rows: 10,
      rowsPerPageOptions: [10, 20, 50, 100],
    },

    headers: [
      {
        cols: [
          {
            label: 'Tier',
            valueField: 'tier',
            classes: 'text-left',
            isSort: false,
            filter: {
              isFilter: true,
              type: 'contains',
            },
            selected: true,
          },
          {
            label: 'Server',
            valueField: 'server',
            classes: 'text-left',
            isSort: false,
            filter: {
              isFilter: false,
              type: 'contains',
            },
            selected: true,
          },
          {
            label: 'Name',
            valueField: 'name',
            classes: 'text-left',
            isSort: true,

            filter: {
              isFilter: true,
              type: 'contains',
            },
            selected: true,
          },
          {
            label: 'Description',
            valueField: 'desc',
            classes: 'text-left',
            isSort: true,

            filter: {
              isFilter: true,
              type: 'contains',
            },
            selected: true,
          },
          {
            label: 'Goal',
            valueField: 'goal',
            classes: 'text-left',
            isSort: true,

            filter: {
              isFilter: true,
              type: 'contains',
            },
            selected: true,
            width: '10%',
          },
          {
            label: 'Status',
            valueField: 'status',
            classes: 'text-left',
            isSort: true,

            filter: {
              isFilter: true,
              type: 'contains',
            },
            selected: true,
            width: '10%',
          },
        ],
      },
    ],
    data: [
      {
        tier: 'icons8 ',
        server: 'icons8 ',
        name: 'SessionPageFail',
        desc: 'Session and Page Failed',
        goal: '5',
        status: 'completed',
      },

      {
        tier: 'icons8 icons8-save-as',
        server: 'icons8 ',
        name: 'Feedback',
        desc: 'Feedback Event',
        goal: '5',
      },
      {
        tier: 'icons8 ',
        server: 'icons8 ',
        name: 'HighPageResponse',
        desc: 'Event for long duration Session',
        goal: '5',
      },
      {
        tier: 'icons8 ',
        server: 'icons8 ',
        name: 'SessionHavingPageLoops',
        desc: 'High Page Response Event',
        goal: '5',
      },
      {
        tier: 'icons8 icons8-error',
        server: 'icons8 ',
        name: 'SessionHavingExceptions',
        desc: 'Session Having Loop',
        goal: '5',
      },
      {
        tier: 'icons8 icons8-error',
        server: 'icons8 ',
        name: 'ClickEvent',
        desc: 'Sessions Having Exception',
        goal: '5',
      },
      {
        tier: 'icons8 icons8-archive-folder',
        server: 'icons8 ',
        name: 'AjaxError',
        desc: 'Ajax Call Failure Event',
        goal: '5',
      },
      {
        tier: 'icons8 icons8-archive-folder',
        server: 'icons8 ',
        name: 'JsError',
        desc: 'JS Error Failure Event',
        goal: '5',
      },
      {
        tier: 'icons8 icons8-save-as',
        server: 'icons8 ',
        name: 'SlowServerResponseTime',
        desc: 'ND SlowTransaction',
        goal: '5',
      },
      {
        tier: 'icons8 icons8-error',
        server: 'icons8 ',
        name: 'PageDistorted',
        desc: 'Web Page Distorted',
        goal: '5',
      },
      {
        tier: 'icons8 icons8-error',
        server: 'icons8 ',
        name: 'PageDistorted',
        desc: 'Web Page Distorted',
        goal: '5',
      },
      {
        tier: 'icons8 icons8-error',
        server: 'icons8 ',
        name: 'PageDistorted',
        desc: 'Web Page Distorted',
        goal: '5',
      },
      {
        tier: 'icons8 icons8-error',
        server: 'icons8 ',
        name: 'PageDistorted',
        desc: 'Web Page Distorted',
        goal: '5',
      },
      {
        tier: 'icons8 icons8-error',
        server: 'icons8 ',
        name: 'PageDistorted',
        desc: 'Web Page Distorted',
        goal: '5',
      },
      {
        tier: 'icons8 icons8-error',
        server: 'icons8 ',
        name: 'PageDistorted',
        desc: 'Web Page Distorted',
        goal: '5',
      },
      {
        tier: 'icons8 icons8-error',
        server: 'icons8 ',
        name: 'PageDistorted',
        desc: 'Web Page Distorted',
        goal: '5',
      },
      {
        tier: 'icons8 icons8-error',
        server: 'icons8 ',
        name: 'PageDistorted',
        desc: 'Web Page Distorted',
        goal: '5',
      },
      {
        tier: 'icons8 icons8-error',
        server: 'icons8 ',
        name: 'PageDistorted',
        desc: 'Web Page Distorted',
        goal: '5',
      },
      {
        tier: 'icons8 icons8-error',
        server: 'icons8 ',
        name: 'PageDistorted',
        desc: 'Web Page Distorted',
        goal: '5',
      },
      {
        tier: 'icons8 icons8-error',
        server: 'icons8 ',
        name: 'PageDistorted',
        desc: 'Web Page Distorted',
        goal: '5',
      },
      {
        tier: 'icons8 icons8-error',
        server: 'icons8 ',
        name: 'PageDistorted',
        desc: 'Web Page Distorted',
        goal: '5',
      },
      {
        tier: 'icons8 icons8-error',
        server: 'icons8 ',
        name: 'PageDistorted',
        desc: 'Web Page Distorted',
        goal: '5',
      },
      {
        tier: 'icons8 icons8-error',
        server: 'icons8 ',
        name: 'PageDistorted',
        desc: 'Web Page Distorted',
        goal: '5',
      },
      {
        tier: 'icons8 icons8-error',
        server: 'icons8 ',
        name: 'PageDistorted',
        desc: 'Web Page Distorted',
        goal: '5',
      },
      {
        tier: 'icons8 icons8-error',
        server: 'icons8 ',
        name: 'PageDistorted',
        desc: 'Web Page Distorted',
        goal: '5',
      },
      {
        tier: 'icons8 icons8-error',
        server: 'icons8 ',
        name: 'PageDistorted',
        desc: 'Web Page Distorted',
        goal: '5',
      },
      {
        tier: 'icons8 icons8-error',
        server: 'icons8 ',
        name: 'PageDistorted',
        desc: 'Web Page Distorted',
        goal: '5',
      },
      {
        tier: 'icons8 icons8-error',
        server: 'icons8 ',
        name: 'PageDistorted',
        desc: 'Web Page Distorted',
        goal: '5',
      },
      {
        tier: 'icons8 icons8-error',
        server: 'icons8 ',
        name: 'PageDistorted',
        desc: 'Web Page Distorted',
        goal: '5',
      },
      {
        tier: 'icons8 icons8-error',
        server: 'icons8 ',
        name: 'PageDistorted',
        desc: 'Web Page Distorted',
        goal: '5',
      },
      {
        tier: 'icons8 icons8-error',
        server: 'icons8 ',
        name: 'PageDistorted',
        desc: 'Web Page Distorted',
        goal: '5',
      },
      {
        tier: 'icons8 icons8-error',
        server: 'icons8 ',
        name: 'PageDistorted',
        desc: 'Web Page Distorted',
        goal: '5',
      },
      {
        tier: 'icons8 icons8-error',
        server: 'icons8 ',
        name: 'PageDistorted',
        desc: 'Web Page Distorted',
        goal: '5',
      },
    ],
    tableFilter: true,
  },
};
