import { Table } from "src/app/shared/table/table.model";
import { AutoCompleteData } from "./app-crash-filter.model";


export const APP_CRASH_FILTER_TABLE: Table = {

  paginator: {
    first: 1,
    rows: 10,
    rowsPerPageOptions: [10, 25, 50, 100],
  },

  headers: [
    {
      cols: [
        {
          label: 'Exception',
          valueField: 'exception_name',
          classes: 'text-left',
          selected: true,
          filter: {
            isFilter: true,
            type: 'contains',
          },
          isSort: true,
        },
        {
          label: 'Exception Message',
          valueField: 'exception_message',
          classes: 'text-left',
          selected: true,
          filter: {
            isFilter: true,
            type: 'contains',
          },
          isSort: true,
        },
        {
          label: 'Crashed File Name',
          valueField: 'filename',
          classes: 'text-left',
          selected: true,
          filter: {
            isFilter: true,
            type: 'contains',
          },
          isSort: true,
        },
        {
          label: 'Function Name',
          valueField: 'functionname',
          classes: 'text-left',
          selected: true,
          filter: {
            isFilter: true,
            type: 'contains',
          },
          isSort: true,
        },
        {
          label: 'Count',
          valueField: 'count',
          classes: 'text-right',
          selected: true,
          filter: {
            isFilter: true,
            type: 'contains',
          },
          isSort: true,
        }
      ],
    },
  ],
  data: []
};

export const AUTOCOMPLETE_DATA: AutoCompleteData = {
  autocompleteData: [
    { name: 'HANDLEDEXCEPTION' },
    { name: 'TIZEN' },
    { name: 'SESSIONINVALID' },
  ],
}
