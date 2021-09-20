import { VisualTable } from './visual-table.model';

export const VISUAL_TABLE: VisualTable = {
 
  paginator: {
    first: 1,
    rows: 33,
    rowsPerPageOptions: [3, 5, 10, 25, 50, 100],
  },

  headers: [
    {
      cols: [
        {
          label: '@timestamp per 30 sec',
          valueField: 'timestamp',
          classes: 'text-left',
          selected: true,
          filter: {
            isFilter: true,
            type: 'contains',
          },
          isSort: true,
          width: '80%'
        },
        {
          label: 'Count',
          valueField: 'count',
          classes: 'text-left',
          selected: true,
          filter: {
            isFilter: true,
            type: 'contains',
          },
          isSort: true,
          width: '20%'
        }          
      ],
    },
  ],
  data: [],

  tableFilter: true,
};

