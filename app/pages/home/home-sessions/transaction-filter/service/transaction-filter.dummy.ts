import { AutoCompleteData, TransactionFilterTable } from './transaction-filter.model';


export const TRANSACTION_AGG_FILTER_TABLE: TransactionFilterTable = {
  paginator: {
    first: 0,
    rows: 15,
    rowsPerPageOptions: [15, 30, 50, 100],
  },
  headers: [
    {
      cols: [
        {
          label: 'Start Time',
          valueField: 'formattedStartTime',
          classes: 'text-right',
          selected: true,
          filter: {
            isFilter: true,
            type: 'contains',
          },
          isSort: true,
        },
        {
          label: 'Transaction Name',
          valueField: 'name',
          classes: 'text-left',
          selected: true,
          filter: {
            isFilter: true,
            type: 'contains',
          },
          isSort: true,
        },
        {
          label: 'Duration',
          valueField: 'formattedDuration',
          classes: 'text-right',
          selected: true,
          filter: {
            isFilter: true,
            type: 'contains',
          },
          isSort: true,
        },
        {
          label: 'Page Name',
          valueField: 'pageName',
          classes: 'text-left',
          selected: true,
          filter: {
            isFilter: true,
            type: 'contains',
          },
          isSort: true,
        },
        {
          label: 'Sid',
          valueField: 'sid',
          classes: 'text-right',
          selected: true,
          filter: {
            isFilter: true,
            type: 'contains',
          },
          isSort: true,
          width: '150px'
        },
        {
          label: 'Page Instance',
          valueField: 'pageInstance',
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
        },
        {
          label: 'Device',
          valueField: 'device',
          classes: 'text-left',
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
          classes: 'text-left',
          selected: false,
          filter: {
            isFilter: true,
            type: 'contains',
          },
          isSort: true,
        },
        {
          label: 'Channel',
          valueField: 'channel',
          classes: 'text-left',
          selected: true,
          filter: {
            isFilter: true,
            type: 'contains',
          },
          isSort: true,
        },
        {
          label: 'Store',
          valueField: 'store',
          classes: 'text-right',
          selected: true,
          filter: {
            isFilter: true,
            type: 'contains',
          },
          isSort: true,
        },
        {
          label: 'Terminal',
          valueField: 'terminal',
          classes: 'text-right',
          selected: true,
          filter: {
            isFilter: true,
            type: 'contains',
          },
          isSort: true,
        },

        {
          label: 'Failed Transaction',
          valueField: 'failedTransaction',
          classes: 'text-left',
          selected: true,
          filter: {
            isFilter: true,
            type: 'contains',
          },
          isSort: true,
        },
        {
          label: 'Client Ip',
          valueField: 'clientIp',
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
