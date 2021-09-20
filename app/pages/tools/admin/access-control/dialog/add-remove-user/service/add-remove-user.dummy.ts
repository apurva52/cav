import { AddRemoveUserTable } from './add-remove-user.model';

export const ADDREMOVEUSER_TABLE: AddRemoveUserTable = {
  // paginator: {
  //   first: 1,
  //   rows: 10,
  //   // rowsPerPageOptions: [3, 5, 10, 25, 50, 100],
  // },
  headers: [
    {
      cols: [
        {
          label: 'Name',
          valueField: 'name',
          classes: 'text-left',
          selected: true,
          isSort: true,
          filter: {
            isFilter: true,
            type: 'contains',
          },
        },
        {
          label: 'Type',
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
          label: 'DIN',
          valueField: 'din',
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
      name: 'Ashish Kakade',
      type: 'Native',
      din: '-',
    },
    {
      name: 'Tejaswini Gharge',
      type: 'Native',
      din: '-',
    },
    {
      name: 'Ashish Kakade',
      type: 'Native',
      din: '-',
    },
    {
      name: 'Ashish Kakade',
      type: 'Native',
      din: '-',
    },
    {
      name: 'Ashish Kakade',
      type: 'Native',
      din: '-',
    },
    {
      name: 'Ashish Kakade',
      type: 'Native',
      din: '-',
    },
    {
      name: 'Ashish Kakade',
      type: 'Native',
      din: '-',
    },
    {
      name: 'Ashish Kakade',
      type: 'Native',
      din: '-',
    },
    {
      name: 'Ashish Kakade',
      type: 'Native',
      din: '-',
    },
    {
      name: 'Ashish Kakade',
      type: 'Native',
      din: '-',
    },
    {
      name: 'Ashish Kakade',
      type: 'Native',
      din: '-',
    },
    {
      name: 'Ashish Kakade',
      type: 'Native',
      din: '-',
    },
    {
      name: 'Ashish Kakade',
      type: 'Native',
      din: '-',
    },
    {
      name: 'Ashish Kakade',
      type: 'Native',
      din: '-',
    },
    {
      name: 'Ashish Kakade',
      type: 'Native',
      din: '-',
    },
  ],
  tableFilter: true,
};
