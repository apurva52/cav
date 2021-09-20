import { ServiceMethodTimingData } from './service-method-timing.model';

export const SERVICE_METHOD_TIMING_DATA: ServiceMethodTimingData = {
  smtData: {
    headers: [
      {
        cols: [
          {
            label: 'Package',
            valueField: 'Package',
            classes: 'text-center',
            selected: true,
            urlField: true,
            iconField: false,
            filter: {
              isFilter: true,
              type: 'contains',
            },
            isSort: true,
            severityColorField: true,
          },
          {
            label: 'Class',
            valueField: 'Class',
            classes: 'text-center',
            selected: true,
            urlField: false,
            iconField: false,
            filter: {
              isFilter: true,
              type: 'contains',
            },
            isSort: true,
          },
          {
            label: 'Method',
            valueField: 'Method',
            classes: 'text-center',
            selected: true,
            urlField: false,
            iconField: false,
            filter: {
              isFilter: true,
              type: 'contains',
            },
            isSort: true,
          },
          {
            label: 'Percentage',
            valueField: 'Percentage',
            classes: 'text-center',
            selected: true,
            urlField: false,
            iconField: false,
            filter: {
              isFilter: true,
              type: 'contains',
            },
            isSort: true,
          },
          {
            label: 'Cum self timing',
            valueField: 'CumSelfTiming',
            classes: 'text-center',
            selected: true,
            urlField: false,
            iconField: false,
            filter: {
              isFilter: true,
              type: 'contains',
            },
            isSort: true,
          },
          {
            label: 'Avg self timing',
            valueField: 'AvgSelfTiming',
            classes: 'text-center',
            selected: true,
            urlField: false,
            iconField: false,
            filter: {
              isFilter: true,
              type: 'contains',
            },
            isSort: true,
          },
          {
            label: 'Avg CPU self time',
            valueField: 'AvgCPUSelfTime',
            classes: 'text-center',
            selected: true,
            urlField: false,
            iconField: false,
            filter: {
              isFilter: true,
              type: 'custom',
            },
            isSort: true,
          },
          {
            label: 'Count',
            valueField: 'Count',
            classes: 'text-center',
            selected: true,
            urlField: false,
            iconField: false,
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
        Package: 'First',
        Class: 'middleware',
        Method: 'setFavouriteEachDC1',
        Percentage: '23.667',
        CumSelfTiming: '0.01',
        AvgSelfTiming: '13',
        AvgCPUSelfTime: '11.921',
        Count: '3',
        severityBgColorField: '#337ABA',
        url: '/dashboard-service-req/method-timing/',
        icon: 'icons8 icons8-filter',
      },
      {
        Package: 'source/middleware',
        Class: 'middleware',
        Method: 'setFavouriteEachDC2',
        Percentage: '23.667',
        CumSelfTiming: '0.01',
        AvgSelfTiming: '13',
        AvgCPUSelfTime: '11.921',
        Count: '3',
        severityBgColorField: '#89b0d3',
        url: false,
      },
      {
        Package: 'Third',
        Class: 'middleware',
        Method: 'setFavouriteEachDC3',
        Percentage: '23.667',
        CumSelfTiming: '0.01',
        AvgSelfTiming: '13',
        AvgCPUSelfTime: '11.921',
        Count: '3',
        severityBgColorField: '#337ABA',
        url: false,
      },
      {
        Package: 'source/middleware',
        Class: 'middleware',
        Method: 'setFavouriteEachDC4',
        Percentage: '23.667',
        CumSelfTiming: '0.01',
        AvgSelfTiming: '13',
        AvgCPUSelfTime: '11.921',
        Count: '3',
        severityBgColorField: '#89b0d3',
        url: false,
      },
      {
        Package: '5',
        Class: 'middleware',
        Method: 'setFavouriteEachDC4',
        Percentage: '23.667',
        CumSelfTiming: '0.01',
        AvgSelfTiming: '13',
        AvgCPUSelfTime: '11.921',
        Count: '3',
        severityBgColorField: '#337ABA',
        url: false,
      },
      {
        Package: 'source/middleware',
        Class: 'middleware',
        Method: 'setFavouriteEachDC4',
        Percentage: '23.667',
        CumSelfTiming: '0.01',
        AvgSelfTiming: '13',
        AvgCPUSelfTime: '11.921',
        Count: '3',
        severityBgColorField: '#89b0d3',
        url: false,
      },
      {
        Package: '7',
        Class: 'middleware',
        Method: 'setFavouriteEachDC4',
        Percentage: '23.667',
        CumSelfTiming: '0.01',
        AvgSelfTiming: '13',
        AvgCPUSelfTime: '11.921',
        Count: '3',
        severityBgColorField: '#337ABA',
        url: false,
      },
      {
        Package: 'source/middleware',
        Class: 'middleware',
        Method: 'setFavouriteEachDC4',
        Percentage: '23.667',
        CumSelfTiming: '0.01',
        AvgSelfTiming: '13',
        AvgCPUSelfTime: '11.921',
        Count: '3',
        severityBgColorField: '#89b0d3',
        url: false,
      },
      {
        Package: '9',
        Class: 'middleware',
        Method: 'setFavouriteEachDC2',
        Percentage: '23.667',
        CumSelfTiming: '0.01',
        AvgSelfTiming: '13',
        AvgCPUSelfTime: '11.921',
        Count: '3',
        severityBgColorField: '#337ABA',
        url: false,
      },
    ],
    paginator: {
      first: 1,
      rows: 2,
      rowsPerPageOptions: [2, 3, 10, 20, 30, 50, 100],
    },

    tableFilter: false,
    rowBgColorField: 'rowBgColor',
  },
};