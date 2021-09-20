import { AutoCompleteData, SessionsTable } from "./home-sessions.model";


export const SESSION_TABLE: SessionsTable = {
    paginator: {
      first: 0,
      rows: 15,
      rowsPerPageOptions: [15, 30, 50, 100],
    },

    headers: [
      {
        cols: [
          {
            label: 'Actions',
            valueField: 'actions',
            classes: 'text-center',
            severityColorField: true,
            selected: true,
            filter: {
              isFilter: false,
              type: 'contains',
            },
            isSort: true,            
          },
          {
            label: 'Session ID',
            valueField: 'sid',
            classes: 'text-right',
            selected: false,
            filter: {
              isFilter: true,
              type: 'contains',
            },
            isSort: true,
          },
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
            width: '130px'
          },
          {
            label: 'Entry Page',
            valueField: 'entryPage',
            classes: 'text-left',
            selected: true,
            filter: {
              isFilter: true,
              type: 'contains',
            },
            isSort: true,
          },
          {
            label: 'Event(s)',
            valueField: 'events',
            classes: 'text-center',
            selected: true,
            filter: {
              isFilter: false,
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
            width:'160px'
          },
	   {
          label: 'Duration',
          valueField: 'duration',
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
            classes: 'text-left',
            selected: true,
            filter: {
              isFilter: true,
              type: 'contains',
            },
            isSort: true,
          },
          {
            label: 'Page(s)',
            valueField: 'pageCount',
            classes: 'text-right',
            selected: true,
            filter: {
              isFilter: true,
              type: 'contains',
            },
            isSort: true,
            width: '80px'
          },
          {
            label: 'Device',
            valueField: 'deviceType',
            classes: 'text-left',
            selected: true,
            filter: {
              isFilter: true,
              type: 'contains',
            },
            isSort: true,
            width: '80px'
          },
          {
            label: 'Order Total',
            valueField: 'orderTotal',
            classes: 'text-right',
            selected: false,
            filter: {
              isFilter: true,
              type: 'contains',
            },
            isSort: true,
          },
          {
            label: 'Order(s)',
            valueField: 'orderCount',
            classes: 'text-right',
            selected: false,
            filter: {
              isFilter: true,
              type: 'contains',
            },
            isSort: true,
          },
          {
            label: 'Client IP',
            valueField: 'clientIp',
            classes: 'text-right',
            selected: true,
            filter: {
              isFilter: true,
              type: 'contains',
            },
            isSort: true,
          },
          {
            label: 'Login ID',
            valueField: 'loginId',
            classes: 'text-left',
            selected: true,
            filter: {
              isFilter: true,
              type: 'contains',
            },
            isSort: true,
          },
          {
            label: 'Max Onload',
            valueField: 'maxOnLoad',
            classes: 'text-right',
            selected: false,
            filter: {
              isFilter: true,
              type: 'contains',
            },
            isSort: true,
          },
          {
            label: 'Avg Onload',
            valueField: 'avgOnLoad',
            classes: 'text-right',
            selected: false,
            filter: {
              isFilter: true,
              type: 'contains',
            },
            isSort: true,
          },
          {
            label: 'Max TTDI',
            valueField: 'maxTTDI',
            classes: 'text-right',
            selected: false,
            filter: {
              isFilter: true,
              type: 'contains',
            },
            isSort: true,
          },
          {
            label: 'Avg TTDI',
            valueField: 'avgTTDI',
            classes: 'text-right',
            selected: false,
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
            selected: true,
            filter: {
              isFilter: true,
              type: 'contains',
            },
            isSort: true,
          },
          {
            label: 'Store ID',
            valueField: 'store',
            classes: 'text-right',
            selected: false,
            filter: {
              isFilter: true,
              type: 'contains',
            },
            isSort: true,
          },
          {
            label: 'Terminal ID',
            valueField: 'terminal',
            classes: 'text-right',
            selected: false,
            filter: {
              isFilter: true,
              type: 'contains',
            },
            isSort: true,
          },
          {
            label: 'Connection Type',
            valueField: 'conType',
            classes: 'text-left',
            selected: false,
            filter: {
              isFilter: true,
              type: 'contains',
            },
            isSort: true,
          },
          {
            label: 'App Start Time(s)',
            valueField: 'appstarttime',
            classes: 'text-right',
            selected: false,
            filter: {
              isFilter: true,
              type: 'contains',
            },
            isSort: true,
          }
         
        ],
      },
    ],
    data: [
    ],   
    severityBgColorField: 'severityColor',
};

export const AUTOCOMPLETE_DATA: AutoCompleteData = {
  autocompleteData: [
    { name: 'HANDLEDEXCEPTION' },
    { name: 'TIZEN' },
    { name: 'SESSIONINVALID' },
  ],
}
