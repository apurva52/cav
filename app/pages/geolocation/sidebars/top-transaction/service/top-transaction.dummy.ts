import { TopTransactionData } from './top-transaction.model';

export const TOP_TRANSACTION_DATA: TopTransactionData = {
  topTransaction: {
    headers: [
      {
        cols: [
          {
            label: 'Transactions',
            valueField: 'field1',
            classes: 'text-left',
            filter: {
              isFilter: true,
              type: 'contains',
            },
            isSort: true,
            width: '20%',
          },
          {
            label: 'TPS',
            valueField: 'field2',
            classes: 'text-left',
            filter: {
              isFilter: true,
              type: 'contains',
            },
            isSort: true,
          },
          {
            label: 'Count',
            valueField: 'field3',
            classes: 'text-left',
            filter: {
              isFilter: true,
              type: 'contains',
            },
            isSort: true,
          },
        ],
      },
    ],
    data: [
      {
        field1: 'Calls/en',
        field2: '0.234',
        field3: '11',
      },
      {
        field1: 'calls/en',
        field2: '0.234',
        field3: '11',
      },
      {
        field1: 'Calls/en',
        field2: '0.234',
        field3: '11',
      },
      {
        field1: 'Calls/en',
        field2: '0.234',
        field3: '11',
      },
      {
        field1: 'Calls/en',
        field2: '0.234',
        field3: '11',
      },
      {
        field1: 'Calls/en',
        field2: '0.234',
        field3: '11',
      },
      {
        field1: 'calls/en',
        field2: '0.234',
        field3: '11',
      },
      {
        field1: 'Calls/en',
        field2: '0.234',
        field3: '11',
      },
      {
        field1: 'Calls/en',
        field2: '0.234',
        field3: '11',
      },
      {
        field1: 'Calls/en',
        field2: '0.234',
        field3: '11',
      },
    ],
    tableFilter: true,
  },
};
