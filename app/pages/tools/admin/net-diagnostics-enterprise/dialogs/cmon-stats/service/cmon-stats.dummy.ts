import { Table } from 'src/app/shared/table/table.model';

export const CMON_STAT_TABLE: Table = {
  paginator: {
    first: 1,
    rows: 10,
    rowsPerPageOptions: [10, 25, 50, 100],
  },

  headers: [
    {
      cols: [
        {
          label: 'Thread Id',
          valueField: 'Id',
          classes: 'text-left',
          selected: true,
          isSort: true,
          filter: {
            isFilter: true,
            type: 'contains',
          },
         
        },
        {
          label: 'Thread Type',
          valueField: 'type',
          classes: 'text-left',
          selected: true,
          isSort: true,
          filter: {
            isFilter: true,
            type: 'contains',
          },
         
        },
        {
          label: 'Test Run',
          valueField: 'testrun',
          classes: 'text-left',
          selected: true,
          isSort: true,
          filter: {
            isFilter: true,
            type: 'contains',
          },
         
        },
        {
          label: 'Program Name',
          valueField: 'programname',
          classes: 'text-left',
          selected: true,
          isSort: true,
          filter: {
            isFilter: true,
            type: 'contains',
          },
         
        },
        {
          label: 'Program Arguments',
          valueField: 'programarguments',
          classes: 'text-left',
          selected: true,
          isSort: true,
          filter: {
            isFilter: true,
            type: 'contains',
          },
         
        },
        {
          label: 'Start Date Time',
          valueField: 'datetime',
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
      Id:1,
      type:'xyz',
      testrun:'abc',
      programname:'xyz',
      programarguments:'wxy',
      datetime:'2020/10/21:20:20/22',

    },
    {
      Id:1,
      type:'xyz',
      testrun:'abc',
      programname:'xyz',
      programarguments:'wxy',
      datetime:'2020/10/21:20:20/22',

    },
    {
      Id:1,
      type:'xyz',
      testrun:'abc',
      programname:'xyz',
      datetime:'2020/10/21:20:20/22',

    },
    {
      Id:1,
      type:'xyz',
      testrun:'abc',
      programname:'xyz',
      programarguments:'wxy',
      datetime:'2020/10/21:20:20/22',

    },
    {
      Id:1,
      type:'xyz',
      testrun:'abc',
      programname:'xyz',
      programarguments:'wxy',
      datetime:'2020/10/21:20:20/22',

    },
    {
      Id:1,
      type:'xyz',
      testrun:'abc',
      programname:'xyz',
      programarguments:'wxy',
      datetime:'2020/10/21:20:20/22',

    },
    {
      Id:1,
      type:'xyz',
      testrun:'abc',
      programname:'xyz',
      programarguments:'wxy',
      datetime:'2020/10/21:20:20/22',

    },
    {
      Id:1,
      type:'xyz',
      testrun:'abc',
      programname:'xyz',
      programarguments:'wxy',
      datetime:'2020/10/21:20:20/22',

    },
    {
      Id:1,
      type:'xyz',
      testrun:'abc',
      programname:'xyz',
      programarguments:'wxy',
      datetime:'2020/10/21:20:20/22',

    },
    {
      Id:1,
      type:'xyz',
      testrun:'abc',
      programname:'xyz',
      programarguments:'wxy',
      datetime:'2020/10/21:20:20/22',

    },
    {
      Id:1,
      type:'xyz',
      testrun:'abc',
      programname:'xyz',
      programarguments:'wxy',
      datetime:'2020/10/21:20:20/22',

    },
    {
      Id:1,
      type:'xyz',
      testrun:'abc',
      programname:'xyz',
      programarguments:'wxy',
      datetime:'2020/10/21:20:20/22',

    },
    {
      Id:1,
      type:'xyz',
      testrun:'abc',
      programname:'xyz',
      programarguments:'wxy',
      datetime:'2020/10/21:20:20/22',

    },
    {
      Id:1,
      type:'xyz',
      testrun:'abc',
      programname:'xyz',
      programarguments:'wxy',
      datetime:'2020/10/21:20:20/22',

    },
    
    
    
  ],
  tableFilter: true,
};
