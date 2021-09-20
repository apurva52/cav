import { TableBoxTable } from './table-box.model';

export const TABLE_BOX_TABLE: TableBoxTable = {
  search: {
    fields: [
      'calloutTime',
      'queries',
      'startTime',
      'duration',
      'networkDelayRes',
      'networkDelayReq',
    ],
  },

  sort: {
    fields: ['calloutTime',
      'queries',
      'startTime',
      'duration',
      'networkDelayRes',
      'networkDelayReq(ms)',
    ],
  },

  paginator: {
    first: 0,
    rows: 10,
    rowsPerPageOptions: [10, 20,30, 50, 100],
},

  headers: [
    {
      cols: [
        {
          label: 'Callout Time',
          valueField: 'calloutTime',
          classes: 'text-left',
        },
        {
          label: 'Queries',
          valueField: 'queries',
          classes: 'text-left',
        },
        {
          label: 'Start Time',
          valueField: 'startTime',
          classes: 'text-center',
        },
        {
          label: 'Duration',
          valueField: 'duration',
          classes: 'text-center',
        },
        {
          label: 'Network Delay Res',
          valueField: 'networkDelayRes',
          classes: 'text-center',
        },
        {
          label: 'Network Delay Req',
          valueField: 'networkDelayReq',
          classes: 'text-center',
        },
      ],
    },
  ],
  data: [
    {
      calloutTime: 'httpService/Req',
      queries: '07:09(03/24/20)',
      startTime: '09/02/20 01:49:14',
      duration: '13.107',
      networkDelayRes: '0',
      networkDelayReq: '0',
    },
    
  ],
};