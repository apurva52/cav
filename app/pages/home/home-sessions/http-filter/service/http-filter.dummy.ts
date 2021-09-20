import { HttpAggFilterTable, AutoCompleteData } from "./http-filter.model";



export const HTTP_AGG_FILTER_TABLE: HttpAggFilterTable = {
    paginator: {
      first: 0,
      rows: 15,
      rowsPerPageOptions: [15, 30, 50, 100],
    },
    headers: [
      {
        cols: [
          {
            label: 'Domain',
            valueField: 'domain',
            classes: 'text-right',
            selected: true,
            filter: {
              isFilter: true,
              type: 'contains',
            },
            isSort: true,
          },
          {
            label: 'URL',
            valueField: 'resource',
            classes: 'text-left',
            selected: true,
            filter: {
              isFilter: true,
              type: 'contains',
            },
            isSort: true,
          },
          {
            label: 'Method',
            valueField: 'method',
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
            valueField: 'totalCount',
            classes: 'text-right',
            selected: true,
            filter: {
              isFilter: true,
              type: 'contains',
            },
            isSort: true,
          },
          {
            label: '2xxCount',
            valueField: 'count2xx',
            classes: 'text-right',
            selected: true,
            filter: {
              isFilter: true,
              type: 'contains',
            },
            isSort: true,
          },
          {
            label: '4xxCount',
            valueField: 'count4xx',
            classes: 'text-right',
            selected: true,
            filter: {
              isFilter: true,
              type: 'contains',
            },
            isSort: true,
          },
          {
            label: '5xxCount',
            valueField: 'count5xx',
            classes: 'text-right',
            selected: true,
            filter: {
              isFilter: true,
              type: 'contains',
            },
            isSort: true,
          },
          {
            label: 'failureCode',
            valueField: 'failureCode',
            classes: 'text-right',
            selected: true,
            filter: {
              isFilter: true,
              type: 'contains',
            },
            isSort: true,
          },
          {
            label: 'Avg Response Time(ms)',
            valueField: 'responsetime',
            classes: 'text-right',
            selected: false,
            filter: {
              isFilter: true,
              type: 'contains',
            },
            isSort: true,
          },
          {
            label: 'Max Response Time(ms)',
            valueField: 'maxresponse',
            classes: 'text-right',
            selected: true,
            filter: {
              isFilter: true,
              type: 'contains',
            },
            isSort: true,
          },
          {
            label: 'Min Response Time(ms)',
            valueField: 'minresponse',
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

