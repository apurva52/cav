//import { UserTimingDataTable } from "./user-timing-data.model";
import { HttpDataTable } from "./http-request-data.model";


export interface SessionPageMenuOption {
    label: string;
    routerLink?: any;
    State?: any;
    items?: Array<SessionPageMenuOption>;
}

export const HTTP_REQUEST: HttpDataTable = {
    paginator: {
        first: 1,
        rows: 10,
        rowsPerPageOptions: [5, 10, 25, 50, 100],
    },

    headers: [
        {
	     cols: [
                {
                    label: 'Action',
                    valueField: 'action',
                    classes: 'text-left',
                    selected: true,
                    filter: {
                        isFilter: false,
                        type: 'contains',
                    },
                    isSort: false,
                    width :'55px'
                },
                {
                    label: 'Name',
                    valueField: 'name',
                    classes: 'text-left',
                    selected: true,
                    filter: {
                        isFilter: true,
                        type: 'contains',
                    },
                    isSort: true,
                    width :'150px'
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
                    width :'90px'
                },
                {
                    label: 'Status Code',
                    valueField: 'statusCode',
                    classes: 'text-right',
                    selected: true,
                    filter: {
                        isFilter: true,
                        type: 'contains',
                    },
                    isSort: true,
                    width :'100px'
                },
                {
                    label: 'Domain Name',
                    valueField: 'domainName',
                    classes: 'text-right',
                    selected: true,
                    filter: {
                        isFilter: true,
                        type: 'contains',
                    },
                    isSort: true,
                    width :'150px'
                },
                {
                    label: 'Time Stamp',
                    valueField: 'formattimestamp',
                    classes: 'text-right',
                    selected: true,
                    filter: {
                        isFilter: true,
                        type: 'contains',
                    },
                    isSort: true,
                    width :'130px'
                },
                {
                    label: 'Size',
                    valueField: 'size',
                    classes: 'text-right',
                    selected: true,
                    filter: {
                        isFilter: true,
                        type: 'contains',
                    },
                    isSort: true,
                    width :'90px'
                },
                {
                    label: 'Initiator',
                    valueField: 'initiator',
                    classes: 'text-right',
                    selected: true,
                    filter: {
                        isFilter: true,
                        type: 'contains',
                    },
                    isSort: true,
                    width :'100px'
                },
                {
                    label: 'Timeline',
                    valueField: 'responseTime',
                    classes: 'text-right',
                    selected: true,
                    filter: {
                        isFilter: true,
                        type: 'contains',
                    },
                    isSort: true,
                },


            ]
        }
    ],
    data: [],
    severityBgColorField: 'severityColor',
};

