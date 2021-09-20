import { SessionsDataTable } from "./session-page-data.model";

export interface SessionPageMenuOption {
    label: string;
    routerLink?: any;
    State?: any;
    items?: Array<SessionPageMenuOption>;
}

export const SESSION_PAGE_DATA: SessionsDataTable = {
    paginator: {
        first: 1,
        rows: 10,
        rowsPerPageOptions: [5, 10, 25, 50, 100],
    },
     headers: [
        {
            cols: [
                {
                    label: 'Start Time',
                    valueField: 'navigationStartTime',
                    tooltip:'Start Time',
                    classes: 'text-right',
                    selected: true,
                    filter: {
                        isFilter: true,
                        type: 'contains',
                    },
                    isSort: true,
                    width: '140px'
                },
                {
                    label: 'Page Name',
                    valueField: 'pagename',
                    tooltip:'Page Name',
                    classes: 'text-left',
                    selected: true,
                    filter: {
                        isFilter: true,
                        type: 'contains',
                    },
                    isSort: true,
                    width: '150px'
                },
                {
                    label: 'Events',
                    valueField: 'events',
                    tooltip:'Events',
                    classes: 'text-center',
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
                    label: 'Onload (sec)',
                    valueField: 'timeToLoad',
                    tooltip:'Load Time (sec)',
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
                    valueField: 'timeToDOMComplete',
                    tooltip:'Time to DOM Content Loaded (sec)',
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
                    label: 'TTDI (sec)',
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
                    label: 'TabId',
                    valueField: 'tabid',
                    tooltip:'TAB ID',
                    classes: 'text-right',
                    selected: false,
                    filter: {
                        isFilter: true,
                        type: 'contains',
                    },
                    isSort: true,
                },
                {
                    label: 'Cache (sec)',
                    valueField: 'cacheLookupTime',
                    tooltip:'Cache Lookup Time (sec)',
                    classes: 'text-right',
                    selected: false,
                    filter: {
                        isFilter: true,
                        type: 'contains',
                    },
                    isSort: true,
                },
                {
                    label: 'Dom Time (sec)',
                    valueField: 'domTime',
                    tooltip:'DOM Time (sec)',
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
                    label: 'SSL (sec)',
                    valueField: '',
                    tooltip:'SSL (sec)',
                    classes: 'text-right',
                    selected: false,
                    filter: {
                        isFilter: true,
                        type: 'contains',
                    },
                    isSort: true,
                },
                {
                    label: 'Wait (sec)',
                    valueField: '',
                    tooltip:'Wait (sec)',
                    classes: 'text-right',
                    selected: false,
                    filter: {
                        isFilter: true,
                        type: 'contains',
                    },
                    isSort: true,
                },
                {
                    label: 'Load Event (sec)',
                    valueField: 'loadEventTime',
                    tooltip:'Load Event Time(sec)',
                    classes: 'text-right',
                    selected: false,
                    filter: {
                        isFilter: true,
                        type: 'contains',
                    },
                    isSort: true,
                },
                {
                    label: 'Connection (sec)',
                    valueField: 'connectionTime',
                    tooltip:'Connection Time (sec)',
                    classes: 'text-right',
                    selected: false,
                    filter: {
                        isFilter: true,
                        type: 'contains',
                    },
                    isSort: true,
                },
                {
                    label: 'Unload (sec)',
                    valueField: 'unloadTime',
                    tooltip:'Unload Time (sec)',
                    classes: 'text-right',
                    selected: false,
                    filter: {
                        isFilter: true,
                        type: 'contains',
                    },
                    isSort: true,
                },
                {
                    label: 'Download (sec)',
                    valueField: 'responseTime',
                    tooltip:'Response Time',
                    classes: 'text-right',
                    selected: false,
                    filter: {
                        isFilter: true,
                        type: 'contains',
                    },
                    isSort: true,
                },
                {
                    label: 'Redirection (sec)',
                    valueField: '',
                    tooltip:'Redirection (sec)',
                    classes: 'text-right',
                    selected: false,
                    filter: {
                        isFilter: true,
                        type: 'contains',
                    },
                    isSort: true,
                },
                {
                    label: 'URL',
                    valueField: 'url',
                    tooltip:'URL',
                    classes: 'text-left',
                    selected: false,
		    width: '310px',
                    filter: {
                        isFilter: true,
                        type: 'contains',
                    },
                    isSort: true,
                },
                {
                    label: 'Referrer URL',
                    valueField: 'referrerUrl',
                    tooltip:'Referrer URL',
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
                    valueField: 'redirectionCount',
                    tooltip:'Redirection Count',
                    classes: 'text-right',
                    selected: false,
                    filter: {
                        isFilter: true,
                        type: 'contains',
                    },
                    isSort: true,
                },
                {
                    label: 'BandWidth (sec)',
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
                    label: 'Bytesln',
                    valueField: 'showbytesIn',
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
                    label: 'PageInstance',
                    valueField: 'pageInstance',
                    tooltip:'Page Instance',
                    classes: 'text-right',
                    selected: false,
                    filter: {
                        isFilter: true,
                        type: 'contains',
                    },
                    isSort: true,
                },
                {
                    label: 'Transaction ID',
                    valueField: 'transactionid',
                    tooltip:'Transaction ID',
                    classes: 'text-left',
                    selected: false,
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
                {
                    label: 'FID (sec)',
                    valueField: 'firstinputdelay',
                    tooltip:'First Input Delay (sec)',
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
                    selected: false,
                    filter: {
                        isFilter: true,
                        type: 'contains',
                    },
                    isSort: true,
                    iconField: true,
                },
                {
                    label: 'FCP (sec)',
                    valueField: 'firstcontentpaint',
                    tooltip:'First Contentful Paint (sec)',
                    classes: 'text-right',
                    selected: false,
                    filter: {
                        isFilter: true,
                        type: 'contains',
                    },
                    isSort: true,
                    iconField: true,
                },

            ],
        },
    ],
  
    data: [],
    severityBgColorField: 'severityColor',
};
