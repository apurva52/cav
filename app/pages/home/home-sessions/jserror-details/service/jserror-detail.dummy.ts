import { JsErrorAggFilterTable } from  "../../js-error-filter/service/js-error.model";


export const JSERROR_DETAIL_FILTER_TABLE: JsErrorAggFilterTable = {
    paginator: {
      first: 0,
      rows: 15,
      rowsPerPageOptions: [15, 30, 50, 100],
    },

    headers: [
      {
        cols: [
          {
            label: 'TimeStamp',
            valueField: 'timestamp',
            classes: 'text-left',
            selected: true,
            filter: {
              isFilter: true,
              type: 'contains',
            },
            isSort: true,
          },
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
            classes: 'text-right',
            selected: true,
            filter: {
              isFilter: true,
              type: 'contains',
            },
            isSort: true,
            width: '130px'
          },
          {
            label: 'FileName',
            valueField: 'filename',
            classes: 'text-right',
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
            label: 'DeviceType',
            valueField: 'device',
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
            label: 'Location',
            valueField: 'location',
            classes: 'text-right',
            selected: true,
            filter: {
              isFilter: true,
              type: 'contains',
            },
            isSort: true,
          },
          {
            label: 'Platform',
            valueField: 'platform',
            classes: 'text-right',
            selected: true,
            filter: {
              isFilter: true,
              type: 'contains',
            },
            isSort: true,
          },
          {
            label: 'TerminalId',
            valueField: 'terminalid',
            classes: 'text-right',
            selected: true,
            filter: {
              isFilter: true,
              type: 'contains',
            },
            isSort: true,
          },
          {
            label: 'StoreId',
            valueField: 'storeid',
            classes: 'text-right',
            selected: true,
            filter: {
              isFilter: true,
              type: 'contains',
            },
            isSort: true,
            width: '100px'
          },
          {
            label: 'SessionId',
            valueField: 'sid',
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
  data: [],
  severityBgColorField: 'severityColor',
};
