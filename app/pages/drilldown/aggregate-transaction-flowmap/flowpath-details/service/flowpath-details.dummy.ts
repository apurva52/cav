import { FlowpathDetailsTable } from './flowpath-details.model';

export const FLOWPATH_DETAILS_TABLE: FlowpathDetailsTable = {
  headers: [
    {
      cols: [
        {
          label: '#',
          valueField: 'value',
          classes: 'text-left',
          isSort: true,
        },
        {
          label: 'URL',
          valueField: 'url',
          classes: 'text-left',
          isSort: true,
        },
        {
          label: 'Start Time',
          valueField: 'startTime',
          classes: 'text-left',
          isSort: true,
        },
        {
          label: 'Duration',
          valueField: 'duration',
          classes: 'text-left',
          isSort: true,
        },
        {
          label: 'CPU Time',
          valueField: 'cpuTime',
          classes: 'text-left',
          isSort: true,
        },
        
      ],
    },
  ],
  data: [
    {
      value: '1',
      url: '76',
      startTime: '0',
      duration: '3.241%',
      cpuTime: '0',
  },
  {
    value: '2',
    url: '76',
    startTime: '0',
    duration: '3.241%',
    cpuTime: '0',
  },
  {
    value: '3',
    url: '76',
    startTime: '0',
    duration: '3.241%',
    cpuTime: '0',
  },
  {
    value: '4',
    url: '76',
    startTime: '0',
    duration: '3.241%',
    cpuTime: '0',
  },
  {
    value: '5',
    url: '76',
    startTime: '0',
    duration: '3.241%',
    cpuTime: '0',
  },
  {
    value: '6',
    url: '76',
    startTime: '0',
    duration: '3.241%',
    cpuTime: '0',
  },
  {
    value: '6',
    url: '76',
    startTime: '0',
    duration: '3.241%',
    cpuTime: '0',
  },
  {
    value: '6',
    url: '76',
    startTime: '0',
    duration: '3.241%',
    cpuTime: '0',
  },
  {
    value: '7',
    url: '76',
    startTime: '0',
    duration: '3.241%',
    cpuTime: '0',
  },
  ],
  paginator: {
    first: 0,
    rows: 10,
    rowsPerPageOptions: [ 10, 20,30, 50, 100],
  },
  tableFilter: true,
};
