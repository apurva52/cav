import { UserSegmentTable } from './user-segment.model';
export const USER_SEGMENT_TABLE: UserSegmentTable = {
  paginator: {
    first: 0,
    rows: 5,
    rowsPerPageOptions: [5, 25, 50, 100],
  },

  headers: [
    {
      cols: [
        {
          label: 'Icon',
          valueField: 'iconvalue',
          classes: 'text-center',
          isSort: false,
          width: '6%',
          iconField: true,
          selected: true,
          filter: {
            isFilter: false,
            type: 'contains',
          },
        },
        {
          label: 'Name',
          valueField: 'name',
          classes: 'text-left',
          isSort: true,
          selected: true,

          filter: {
            isFilter: true,
            type: 'contains',
          },
        },
        {
          label: 'Description',
          valueField: 'eventDescription',
          classes: 'text-left',
          isSort: true,
          selected: true,

          filter: {
            isFilter: true,
            type: 'contains',
          },
        },
        {
          label: 'Rules',
          valueField: 'rulelength',
          isSort: true,
          selected: true,
          buttonField: true,
          classes: 'text-right',
          filter: {
            isFilter: true,
            type: 'contains',
          },
        },
      ],
    },
  ],
  data: [],
  iconsField: 'icon',
  tableFilter: true,
};
