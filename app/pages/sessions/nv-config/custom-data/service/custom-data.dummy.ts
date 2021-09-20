import { CustomDataTable } from './custom-data.model';

export const CUSTOM_DATA_TABLE: CustomDataTable = {

  paginator: {
    first: 1,
    rows: 10,
    rowsPerPageOptions: [3, 5, 10, 25, 50, 100],
  },
  headers: [
    {
      cols: [
       
        {
          label: 'Name',
          valueField: 'name',
          classes: 'text-left',
          selected: true,
            filter: {
              isFilter: true,
              type: 'contains',
            },
            isSort: true,
        },
       
        {
          label: 'Description',
          valueField: 'description',
          classes: 'text-left',
          selected: true,
            filter: {
              isFilter: true,
              type: 'contains',
            },
            isSort: true,
            width:'15%'
        },
        {
          label: 'Channel',
          valueField: 'channel',
          classes: 'text-left',
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
  data: [],
  iconsField: 'icon',
  tableFilter: true,
};
