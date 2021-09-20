import { GraphDataTable } from './graph-data.model';

export const GRAPH_DATA_TABLE: GraphDataTable = {
  headers: [
    {
      cols: [
        {
          label: 'Sample Time',
          valueField: 'sampleTime',
          classes: 'text-left',
          filter: {
            isFilter: true,
            type:'contains'
          },
          isSort: true,
        },
        {
          label: 'Total Vusers',
          valueField: 'totalVusers',
          classes: 'text-left',
          filter: {
            isFilter: true,
            type:'contains'
          },
          isSort: true,
        },
        {
          label: 'Active Vusers',
          valueField: 'activeVusers',
          classes: 'text-left',
          filter: {
            isFilter: true,
            type:'contains'
          },
          isSort: true,
        },
        {
          label: 'Thinking Vusers',
          valueField: 'thinkingVusers',
          classes: 'text-left',
          filter: {
            isFilter: true,
            type:'contains'
          },
          isSort: true,
        },
        {
          label: 'Waiting Vusers',
          valueField: 'waitingVusers',
          classes: 'text-left',
          filter: {
            isFilter: true,
            type:'contains'
          },
          isSort: true,
        },
        
      ],
    },
  ],
  data: [
    {
      sampleTime: '11/02/20 23:10:00',
      totalVusers: '76',
      activeVusers: '0',
      thinkingVusers: '3.241%',
      waitingVusers: '0',
    },
    {
      sampleTime: '11/02/20 11:10:00',
      totalVusers: '76',
      activeVusers: '0',
      thinkingVusers: '3.241%',
      waitingVusers: '0',
    },
    {
      sampleTime: '17/02/20 23:10:00',
      totalVusers: '76',
      activeVusers: '0',
      thinkingVusers: '3.241%',
      waitingVusers: '0',
    },
    {
      sampleTime: '11/02/20 21:10:00',
      totalVusers: '76',
      activeVusers: '0',
      thinkingVusers: '3.241%',
      waitingVusers: '0',
    },
    {
      sampleTime: '11/02/20 23:10:00',
      totalVusers: '76',
      activeVusers: '0',
      thinkingVusers: '3.241%',
      waitingVusers: '0',
    },
    {
      sampleTime: '05/02/20 23:10:00',
      totalVusers: '76',
      activeVusers: '0',
      thinkingVusers: '3.241%',
      waitingVusers: '0',
    },
    {
      sampleTime: '11/02/20 23:10:00',
      totalVusers: '76',
      activeVusers: '0',
      thinkingVusers: '3.241%',
      waitingVusers: '0',
    },
    {
      sampleTime: '11/02/20 23:10:00',
      totalVusers: '76',
      activeVusers: '0',
      thinkingVusers: '3.241%',
      waitingVusers: '0',
    },
    {
      sampleTime: '11/02/20 23:10:00',
      totalVusers: '76',
      activeVusers: '0',
      thinkingVusers: '3.241%',
      waitingVusers: '0',
    },
    {
      sampleTime: '11/02/20 23:10:00',
      totalVusers: '76',
      activeVusers: '0',
      thinkingVusers: '3.241%',
      waitingVusers: '0',
    },
    {
      sampleTime: '11/02/20 23:10:00',
      totalVusers: '76',
      activeVusers: '0',
      thinkingVusers: '3.241%',
      waitingVusers: '0',
    },
    {
      sampleTime: '11/02/20 23:10:00',
      totalVusers: '76',
      activeVusers: '0',
      thinkingVusers: '3.241%',
      waitingVusers: '0',
    },
  ],
  paginator: {
    first: 1,
    rows: 33,
    rowsPerPageOptions: [10, 25, 50, 100],
  },
  tableFilter: false,
};
