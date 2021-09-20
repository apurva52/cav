import { Table } from "src/app/shared/table/table.model";
//import { AutoCompleteData } from "./app-crash-filter.model";


export const APP_CRASH_SUMMARY_TABLE: Table = {

  paginator: {
    first: 1,
    rows: 10,
    rowsPerPageOptions: [10, 25, 50, 100],
  },

  headers: [
    {
      cols: [
        {
          label: 'Crash Time',
          valueField: 'crashTime',
          classes: 'text-right',
          selected: true,
          filter: {
            isFilter: true,
            type: 'contains',
          },
          isSort: true,
        },
        {
          label: 'View Name',
          valueField: 'viewName',
          classes: 'text-left',
          selected: true,
          filter: {
            isFilter: true,
            type: 'contains',
          },
          isSort: true,
        },
        {
          label: 'Crashed File',
          valueField: 'crashedFile',
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
          valueField: 'functionName',
          classes: 'text-left',
          selected: true,
          filter: {
            isFilter: true,
            type: 'contains',
          },
          isSort: true,
        },
        {
          label: 'Exception Name',
          valueField: 'exceptionName',
          classes: 'text-left',
          selected: true,
          filter: {
            isFilter: true,
            type: 'contains',
          },
          isSort: true,
        },
         {
          label: 'App',
          valueField: 'appdetails',
          classes: 'text-left',
          selected: true,
          filter: {
            isFilter: true,
            type: 'contains',
          },
          isSort: true,
        },
         {
          label: 'Device',
          valueField: 'devicetype',
          classes: 'text-left',
          selected: true,
          filter: {
            isFilter: true,
            type: 'contains',
          },
          isSort: true,
        },
        {
          label: 'Carrier',
          valueField: 'mobileCarrier',
          classes: 'text-left',
          selected: true,
          filter: {
            isFilter: true,
            type: 'contains',
          },
          isSort: true,
        },
          {
          label: 'Location',
          valueField: 'location',
          classes: 'text-left',
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

