import { CallDetailsData } from './call-details.model';

export const CALL_DETAILS_DATA: CallDetailsData = {
  callDetailsData: {
    paginator: {
      rows: 50,
    },
    headers: [
      {
        cols: [
          {
            label: 'From',
            valueField: 'from',
            classes: 'text-left',
            filter: {
              isFilter: true,
              type: 'contains',
            },
            isSort: true,
          },
          {
            label: 'To',
            valueField: 'to',
            classes: 'text-left',
            filter: {
              isFilter: true,
              type: 'contains',
            },
            isSort: true,
          },
          {
            label: 'Response Time(ms)',
            valueField: 'rtime',
            classes: 'text-right',
            filter: {
              isFilter: true,
              type: 'contains',
            },
            isSort: true,
          },
          {
            label: 'Calls/Sec',
            valueField: 'calls',
            classes: 'text-right',
            filter: {
              isFilter: true,
              type: 'contains',
            },
            isSort: true,
          },
          {
            label: 'Count',
            valueField: 'callCount',
            classes: 'text-right',
            filter: {
              isFilter: true,
              type: 'contains',
            },
            isSort: true,
          },
          {
            label: 'Errors',
            valueField: 'errors',
            classes: 'text-right',
            filter: {
              isFilter: true,
              type: 'contains',
            },
            isSort: true,
          },
          {
            label: 'Errors/Sec',
            valueField: 'errorsec',
            classes: 'text-right',
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
        from: 'tvsc-cprod-blue-tvscorpapi',
        to: 'REDIS_10.184.51.25',
        rtime: '0.353',
        calls: '21',
        callCount: '153186',
        errors: '0',
        errorsec: '0.000',
      },
      {
        from: 'tvsc-cprod-blue-tvscorpapi',
        to: 'REDIS_10.184.51.25',
        rtime: '0.353',
        calls: '21',
        callCount: '153186',
        errors: '0',
        errorsec: '0.000',
      },
      {
        from: 'tvsc-cprod-blue-tvscorpapi',
        to: 'REDIS_10.184.51.25',
        rtime: '0.353',
        calls: '21',
        callCount: '153186',
        errors: '0',
        errorsec: '0.000',
      },
      {
        from: 'tvsc-cprod-blue-tvscorpapi',
        to: 'REDIS_10.184.51.25',
        rtime: '0.353',
        calls: '21',
        callCount: '153186',
        errors: '0',
        errorsec: '0.000',
      },
    ],
  },
};
