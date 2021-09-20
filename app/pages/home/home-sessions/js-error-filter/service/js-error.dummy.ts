import { AutoCompleteData,JsErrorAggFilterTable } from "./js-error.model";


export const JSERROR_AGG_FILTER_TABLE: JsErrorAggFilterTable = {
    paginator: {
      first: 1,
      rows: 15,
      rowsPerPageOptions: [15, 30, 50, 100],
    },
     headers: [
      {
        cols: [
          {
            label: 'Page',
            valueField: 'page',
            classes: 'text-left',
            selected: true,
            filter: {
              isFilter: true,
              type: 'contains',
            },
            isSort: true,
          },
          {
            label: 'ErrorMessage',
            valueField: 'errormessage',
            classes: 'text-left',
            selected: true,
            filter: {
              isFilter: true,
              type: 'contains',
            },
            isSort: true,
          },
          {
            label: 'FileName',
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
            label: 'Line',
            valueField: 'line',
            classes: 'text-right',
            selected: true,
            filter: {
              isFilter: true,
              type: 'contains',
            },
            isSort: true,
          },
          {
            label: 'Columns',
            valueField: 'columns',
            classes: 'text-right',
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
          },
          {
            label: 'Browser',
            valueField: 'browser',
            classes: 'text-right',
            selected: true,
            filter: {
              isFilter: true,
              type: 'contains',
            },
            isSort: true,
          },
          {
            label: 'OS',
            valueField: 'os',
            classes: 'text-right',
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
    data: null,
    severityBgColorField: 'severityColor',
  };
  export const AUTOCOMPLETE_DATA: AutoCompleteData = {
    autocompleteData: [
      { name: 'HANDLEDEXCEPTION' },
      { name: 'TIZEN' },
      { name: 'SESSIONINVALID' },
    ],
  }