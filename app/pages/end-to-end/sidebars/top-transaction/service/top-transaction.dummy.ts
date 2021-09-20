import { TopTransactionTable } from './top-transaction.model';

export const TOP_10_TRANSACTION: TopTransactionTable = {
  search: {
    fields: [
      'transaction',
      'tps',
      'count'
    ],
  },
  

  paginator: {
    rows: 2,
  },

  headers: [
    {
      cols: [
        {
          label: 'Transaction',
          valueField: 'transaction',
          classes: 'text-left',
          selected: true,
          width: '50',
          filter: {
            isFilter: true,
            type:'contains'
          },
          isSort :true
        },
        {
          label: 'Tps',
          valueField: 'tps',
          classes: 'text-right',
          selected: true,
          width: '20',
          filter: {
            isFilter: true,
            type:'contains'
          },
          isSort :true
        },
        {
          label: 'Count',
          valueField: 'count',
          classes: 'text-right',
          selected: true,
          width: '30',
          filter: {
            isFilter: true,
            type:'contains'
          },
          isSort :true
        },
      ],
    },
  ],
  data: [
    {
      transaction: 'src/middleware',   
      tps: '23660',
      count: 5, 
    },
    {
      transaction: 'src/middleware',   
      tps: '23660',
      count: 1, 
    },
    {
      transaction: 'src/middleware',   
      tps: '23660',
      count: 3, 
    },
    {
      transaction: 'src/middleware',   
      tps: '23660',
      count: 3, 
    },
    {
      transaction: 'src/middleware',   
      tps: '23660',
      count: 3, 
    },
    {
      transaction: 'src/middleware',   
      tps: '23660',
      count: 3, 
    },
  ],
 
};
