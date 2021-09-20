import { PageFilterTable, AutoCompleteData } from "./page-filter.model";


export const PAGE_FILTER_TABLE: PageFilterTable = {
  paginator: {
    first: 0,
    rows: 15,
    rowsPerPageOptions: [15, 30, 50, 100],
  },
  filtermode: null,
  headers: [
    {
      cols: [
        {
          label: 'Action',
          valueField: 'action',
          tooltip:'Action',
          classes: 'text-left',
          selected: true,
          filter: {
            isFilter: false,
            type: 'contains',
          },
          isSort: false,
        },
        {
          label: 'SessionID',
          valueField: 'sid',
          tooltip:'Session ID',
          classes: 'text-right',
          selected: false,
          filter: {
            isFilter: true,
            type: 'contains',
          },
          isSort: true,
          width:'150px'
        },
        {
          label: 'Start Time',
          valueField: 'formattedTime',
          tooltip:'Start Time',
          classes: 'text-right',
          selected: true,
          filter: {
            isFilter: true,
            type: 'contains',
          },
          isSort: true,
          width:'120px'
        },
        {
          label: 'Page Name',
          valueField: 'pageName',
          tooltip:'Page Name',
          classes: 'text-left',
          selected: true,
          filter: {
            isFilter: true,
            type: 'contains',
          },
          isSort: true,
          width:'110px'
        },
        {
          label: 'Event(s)',
          valueField: 'events',
          tooltip:'Event(s)',
          classes: 'text-center',
          selected: true,
          filter: {
            isFilter: false,
            type: 'contains',
          },
          isSort: false,
        },
        {
          label: 'Browser',
          valueField: 'browser',
          tooltip:'Browser',
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
          label: 'URL',
          valueField: 'url',
          tooltip:'URL',
          classes: 'text-left',
          selected: true,
          filter: {
            isFilter: true,
            type: 'contains',
          },
          isSort: true,
          width:'200px'
        },
        {
          label: 'Referral',
          valueField: 'referralUrl',
          tooltip:'Referral URL',
          classes: 'text-left',
          selected: false,
          filter: {
            isFilter: true,
            type: 'contains',
          },
          isSort: true,
        },
        // {
        //   label: 'Referrer Url',
        //   valueField: 'referrerUrl',
        //   tooltip:'Referrer URL',
        //   classes: 'text-left',
        //   selected: false,
        //   filter: {
        //     isFilter: true,
        //     type: 'contains',
        //   },
        //   isSort: true,
        // },
        {
          label: 'Device',
          valueField: 'device',
          tooltip:'Device',
          classes: 'text-left',
          selected: true,
          filter: {
            isFilter: true,
            type: 'contains',
          },
          isSort: true,
          width:'80px'
        },
        {
          label: 'OS',
          valueField: 'os',
          tooltip:'OS',
          classes: 'text-left',
          selected: true,
          filter: {
            isFilter: true,
            type: 'contains',
          },
          isSort: true,
        },
        {
          label: 'Channel',
          valueField: 'channel',
          tooltip:'Channel',
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
          tooltip:'Location',
          classes: 'text-left',
          selected: true,
          filter: {
            isFilter: true,
            type: 'contains',
          },
          isSort: true,
        },
        {
          label: 'TTFB (sec)',
          valueField: 'firstByteTime',
          tooltip:'Time to First Byte (sec)',
          classes: 'text-right',
          selected: true,
          filter: {
            isFilter: true,
            type: 'contains',
          },
          isSort: true,
        },
        {
          label: 'onload (sec)',
          valueField: 'onLoad',
          tooltip:'Onload Time (sec)',
          classes: 'text-right',
          selected: true,
          filter: {
            isFilter: true,
            type: 'contains',
          },
          isSort: true,
        },
        {
          label: 'TTDL (sec)',
          valueField: 'timeToLoad',
          tooltip:'Time to DOM Content Load (sec)',
          classes: 'text-right',
          selected: true,
          filter: {
            isFilter: true,
            type: 'contains',
          },
          isSort: true,
        },
        {
          label: 'PRT (sec)',
          valueField: 'percievedRenderTime',
          tooltip:'Percieved Render Time (sec)',
          classes: 'text-right',
          selected: true,
          filter: {
            isFilter: true,
            type: 'contains',
          },
          isSort: true,
        },
        {
          label: 'TTDI',
          valueField: 'domInteractiveTime',
          tooltip:'Time to DOM Interactive',
          classes: 'text-right',
          selected: false,
          filter: {
            isFilter: true,
            type: 'contains',
          },
          isSort: true,
        },
        {
          label: 'Redirection(s)',
          valueField: 'redirection',
          tooltip:'Redirections(s)',
          classes: 'text-right',
          selected: false,
          filter: {
            isFilter: true,
            type: 'contains',
          },
          isSort: true,
        },
        {
          label: 'BandWidth',
          valueField: 'bandWidth',
          tooltip:'Bandwidth',
          classes: 'text-right',
          selected: false,
          filter: {
            isFilter: true,
            type: 'contains',
          },
          isSort: true,
        },
        {
          label: 'BytesIn',
          valueField: 'bytesIn',
          tooltip:'Bytes In',
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
          tooltip:'Client IP',
          classes: 'text-right',
          selected: true,
          filter: {
            isFilter: true,
            type: 'contains',
          },
          isSort: true
        },
        {
          label: 'TransactionId',
          valueField: 'transactionid',
          tooltip:'Transaction ID',
          classes: 'text-right',
          selected: false,
          filter: {
            isFilter: true,
            type: 'contains',
          },
          isSort: true,
        },
        {
          label: 'DNS (sec)',
          valueField: 'dnsTime',
          tooltip:'DNS (sec)',
          classes: 'text-right',
          selected: false,
          filter: {
            isFilter: true,
            type: 'contains',
          },
          isSort: true,
        },
        {
          label: 'DOM (sec)',
          valueField: 'domTime',
          tooltip:'DOM (sec)',
          classes: 'text-right',
          selected: false,
          filter: {
            isFilter: true,
            type: 'contains',
          },
          isSort: true,
        },
        {
          label: 'WAIT (sec)',
          valueField: 'responsetime',
          tooltip:'WAIT (sec)',
          classes: 'text-right',
          selected: false,
          filter: {
            isFilter: true,
            type: 'contains',
          },
          isSort: true,
        },
        {
          label: 'TCP (sec)',
          valueField: 'connectiontime',
          tooltip:'TCP (sec)',
          classes: 'text-right',
          selected: false,
          filter: {
            isFilter: true,
            type: 'contains',
          },
          isSort: true,
        },
        {
          label: 'FP (sec)',
          valueField: 'firstpaint',
          tooltip:'First Paint (sec)',
          classes: 'text-right',
          selected: true,
          filter: {
            isFilter: true,
            type: 'contains',
          },
          isSort: true,
        },
        {
          label: 'FCP (sec)',
          valueField: 'firstcontentpaint',
          tooltip:'First Contentful Paint (sec)',
          classes: 'text-right',
          selected: true,
          filter: {
            isFilter: true,
            type: 'contains',
          },
          isSort: true,
        },
        {
          label: 'FID (sec)',
          valueField: 'firstinputdelay',
          tooltip:'First Input Delay (sec)',
          classes: 'text-right',
          selected: true,
          filter: {
            isFilter: true,
            type: 'contains',
          },
          isSort: true,
        },
        {
          label: 'TTI (sec)',
          valueField: 'timetointeractive',
          tooltip:'Time to Interactive (sec)',
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
export const AUTOCOMPLETE_DATA: AutoCompleteData = {
  autocompleteData: [
    { name: 'HANDLEDEXCEPTION' },
    { name: 'TIZEN' },
    { name: 'SESSIONINVALID' },
  ],
}
