import { MyDashboardsTable } from './dashboards.model';


export const MY_DASHBOARDS_TABLE: MyDashboardsTable = {

  paginator: {
    first: 1,
    rows: 9,
    rowsPerPageOptions: [3, 5, 10, 25, 50, 100],
  },
  options: [],

  headers: [
    {
      cols: [
        {
          label: 'Name',
          valueField: 'label',
          classes: 'text-left',
          filter: {
            isFilter: true,
            type: 'contains',
          },
          isSort: true,
          width:'300px'
        },
        {
          label: 'Last Modified',
          valueField: 'modifiedDate',
          classes: 'text-right',
          filter: {
            isFilter: true,
            type: 'contains',
          },
          isSort: true
        },
        {
          label: 'Date Created',
          valueField: 'creationDate',
          classes: 'text-right',
          filter: {
            isFilter: true,
            type: 'contains',
          },
          isSort: true
        },
        {
          label: 'Total Views',
          valueField: 'frequency',
          classes: 'text-right',
          filter: {
            isFilter: true,
            type: 'contains',
          },
          isSort: true,
        },
        {
          label: 'Owner',
          valueField: 'owner',
          classes: 'text-left',
          filter: {
            isFilter: true,
            type: 'contains',
          },
          isSort: true
        },
        {
          label: 'Actions',
          valueField: 'actions',
          classes: 'text-left'
        }
      ],
    },
  ],
  data: [

  ],
};