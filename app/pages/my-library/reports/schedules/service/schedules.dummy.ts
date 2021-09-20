import { SchedulesTable } from './schedules.model';

export const SCHEDULES_TABLE_DATA: SchedulesTable = {

  paginator: {
    first: 0,
    rows: 10,
    rowsPerPageOptions: [5, 10, 25, 50, 100],
  },

  headers: [
    {
      cols: [
        {
          label: 'Report Type',
          valueField: 'taskType',
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
          valueField: 'taskDes',
          classes: 'text-center',
          selected: true,
          filter: {
            isFilter: true,
            type: 'contains',
          },
          isSort: true,
          //width: '20%'
        },
        {
          label: 'Schedule',
          valueField: 'schTime',
          classes: 'text-left',
          selected: true,
          filter: {
            isFilter: true,
            type: 'contains',
          },
          isSort: true,
        },
        {
          label: 'Expiry',
          valueField: 'expiryTime',
          classes: 'text-center',
          selected: true,
          filter: {
            isFilter: true,
            type: 'contains',
          },
          isSort: true,
        }
        // {
        //   label: 'Status',
        //   valueField: 'status',
        //   classes: 'text-center',
        //   selected: true,
        //   filter: {
        //     isFilter: true,
        //     type: 'contains',
        //   },
        //   isSort: true,
        // },
      ],
    },
  ],
  data: [],

  tableFilter: true,
  
};