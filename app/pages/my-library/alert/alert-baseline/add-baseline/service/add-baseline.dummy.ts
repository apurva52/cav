import { Table } from 'src/app/shared/table/table.model';

export const ADD_BASELINE_TABLE: Table = {
  paginator: {
    first: 1,
    rows: 10,
    rowsPerPageOptions: [10, 25, 50, 100],
  },

  headers: [
    {
      cols: [
       
        
        {
          label: 'Override Days',
          valueField: 'overridedays',
          classes: 'text-left',
          selected: true,
          isSort: true,
          filter: {
            isFilter: true,
            type: 'contains',
          },
       },
       {
          label: 'Day Type',
          valueField: 'daytype',
          classes: 'text-left',
          selected: true,
          isSort: true,
          filter: {
            isFilter: true,
            type: 'contains',
          },
          },

      ],
    },
  ],
  data: [
    {
     
      overridedays: 'xyz',
      daytype: 'abc',

    },
    {
     
      overridedays: 'xyz',
      daytype: 'abc',

    },
    {
     
      overridedays: 'xyz',
      daytype: 'abc',


    },
    {
     
      overridedays: 'xyz',
      daytype: 'abc',

    },
    {
     
      overridedays: 'xyz',
      daytype: 'abc',
    },
    {
     
      overridedays: 'xyz',
      daytype: 'abc',
    },
    {
     


      overridedays: 'xyz',
      daytype: 'abc',
    },
    {
     


      overridedays: 'xyz',
      daytype: 'abc',
    },
    {
     


      overridedays: 'xyz',
      daytype: 'abc',
    },


  ],
  tableFilter: true,
};
