import { SearchSidebarData } from './search-sidebar.model';


export const SEARCH_SIDEBAR_DATA: SearchSidebarData = {

  tableData: {
    search: {
      fields: [
        'name',
        'operation',
        'value'
      ],
    },

    sort: {
      fields: [
        'name',
        'operation',
        'value'
      ],
    },

    paginator: {
      rows: 10,
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
              type:'contains'
            }
          },
          {
            label: 'Operation',
            valueField: 'operation',
            classes: 'text-left',
            filter: {
              isFilter: true,
              type:'contains'
            }
          },
          {
            label: 'Value',
            valueField: 'value',
            classes: 'text-right',
            filter: {
              isFilter: true,
              type:'contains'
            }
          },
        
        ],
      },
    ],
    data:null
  },
  values: {
    tier: [
      { label: 'CC Awe43-front-234', value: 'all' },
      { label: 'Tier1', value: 'Tier1' },
      { label: 'Tier2', value: 'Tier2' },
      { label: 'Tier3', value: 'Tier3' },
      { label: 'Tier4', value: 'Tier4' }
    ],
    mode: [
      { label: 'Exact', value: 'Exact' },
      { label: 'Starts With', value: 'Starts With' },
      { label: 'Ends With', value: 'Ends With' },
      { label: 'Contains', value: 'Contains' }
    ],
    name: [
      { label: 'Select Name', value: 'all' },
      { label: 'Name1', value: 'Name' },
      { label: 'Name2', value: 'Tier2' },
      { label: 'Name3', value: 'Tier3' },
      { label: 'Name4', value: 'Tier4' }
    ],
    operation: [
      { label: 'Equal', value: 'Equal' },
      { label: 'Starts With', value: 'Starts With' },
      { label: 'Ends With', value: 'Ends With' },
      { label: 'Contains', value: 'Contains' }
    ]


  }

};
