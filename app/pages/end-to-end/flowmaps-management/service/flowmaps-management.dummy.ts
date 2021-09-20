import { FlowMapsData } from './flowmaps-management.model';

export const FLOWMAP_TABLE: FlowMapsData = {
  flowmapData: {
    paginator: {
      first: 0,
      rows: 10,
      rowsPerPageOptions: [10, 20, 30, 50, 100],
    },

    headers: [
      {
        cols: [
          {
            label: 'Name',
            valueField: 'name',
            classes: 'text-left',
            filter: {
              isFilter: true,
              type: 'contains',
            },
            isSort: true,
            selected:true
          },
          {
            label: 'Shared',
            valueField: 'shared',
            classes: 'text-left',
            filter: {
              isFilter: false,
              type: 'contains',
            },
            isSort: false,
            selected:true
          },
          {
            label: 'Owner',
            valueField: 'owner',
            classes: 'text-left',
            filter: {
              isFilter: true,
              type: 'contains',
            },
            isSort: true,
            selected:true
          },
        ],
      },
    ],
    data: [
      {
        name: 'Flow Map 1',
        shared: true,
        owner: 'John Doe',
      },
      {
        name: 'Flow Map 2',
        shared: false,
        owner: 'John Doe',
      },
      {
        name: 'Flow Map 3',
        shared: true,
        owner: 'John Doe',
      },
      {
        name: 'Flow Map 4',
        shared: false,
        owner: 'John Doe',
      },
      {
        name: 'Flow Map 5',
        shared: false,
        owner: 'DD',
      },
      {
        name: 'Flow Map 6',
        shared: true,
        owner: 'John Doe',
      },
      {
        name: 'Flow Map 1',
        shared: true,
        owner: 'John Doe',
      },
      {
        name: 'Flow Map 2',
        shared: false,
        owner: 'John Doe',
      },
      {
        name: 'Flow Map 3',
        shared: true,
        owner: 'John Doe',
      },
      {
        name: 'Flow Map 4',
        shared: false,
        owner: 'John Doe',
      },
      {
        name: 'Flow Map 5',
        shared: false,
        owner: 'John Doe',
      },
      {
        name: 'Flow Map 6',
        shared: true,
        owner: 'John Doe',
      },
      {
        name: 'Flow Map 1',
        shared: true,
        owner: 'John Doe',
      },
      {
        name: 'Flow Map 2',
        shared: false,
        owner: 'John Doe',
      },
      {
        name: 'Flow Map 3',
        shared: true,
        owner: 'John Doe',
      },
      {
        name: 'Flow Map 4',
        shared: false,
        owner: 'John Doe',
      },
      {
        name: 'Flow Map 5',
        shared: false,
        owner: 'John Doe',
      },
      {
        name: 'Flow Map 6',
        shared: true,
        owner: 'John Doe',
      },
    ],
    tableFilter: true,
  },
  flowmapOptions: [
    {
      label: 'Default',
      value: 'default',
    },
    {
      label: 'KIOSKAPP',
      value: 'kioskapp',
    },
    {
      label: 'PNF',
      value: 'pnf',
    },
    {
      label: 'SNB',
      value: 'snb',
    },
    {
      label: 'TVS',
      value: 'tvs',
    },
  ],
};
