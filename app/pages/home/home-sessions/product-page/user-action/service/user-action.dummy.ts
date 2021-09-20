import { UserActionTable } from "./user-action.model";


export const USER_ACTION_TABLE: UserActionTable = {
  paginator: {
    first: 1,
    rows: 10,
    rowsPerPageOptions: [5, 10, 25, 50, 100],
  },

  headers: [
    {
      cols: [
        {
          label: 'Offset Time',
          field: 'offset',
          classes: 'text-right',
          selected: true,
          filter: {
            isFilter: true,
            type: 'contains',
          },
          isSort: true,
        },
        {
          label: 'Action',
          field: 'action',
          classes: 'text-left',
          selected: true,
          filter: {
            isFilter: true,
            type: 'contains',
          },
          isSort: true,
        },
        {
          label: 'Input Type',
          field: 'inputType',
          classes: 'text-left',
          selected: true,
          filter: {
            isFilter: true,
            type: 'contains',
          },
          isSort: true,
        },
        {
          label: 'Tag Name',
          field: 'tagName',
          classes: 'text-left',
          selected: true,
          filter: {
            isFilter: true,
            type: 'contains',
          },
          isSort: true,
        },
        {
          label: 'Value',
          field: 'value',
          classes: 'text-left',
          selected: true,
          filter: {
            isFilter: true,
            type: 'contains',
          },
          isSort: true,
        },
        {
          label: 'Position',
          field: 'position',
          classes: 'text-right',
          selected: true,
          filter: {
            isFilter: true,
            type: 'contains',
          },
          isSort: true,
        },
        {
          label: 'id/Xpath',
          field: 'id',
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

  severityBgColorField: 'severityColor',
};