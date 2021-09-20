import { HttpReportData } from './http-report.model';
export const HTTP_REPORT_DUMMY: HttpReportData = {
    panels: [
        {
            paginator: {
                first: 1,
                rows: 10,
                rowsPerPageOptions: [10, 20,30, 50, 100],
            },
            tableFilter: false,

            label: 'HTTP Information',
            collapsed: false,
            headers: [
                {
                    cols: [
                        {
                            label: 'Tier',
                            valueField: 'tier',
                            selected: true,
                            filter: {
                                isFilter: true,
                                type: 'contains',
                            },
                            isSort: true,
                        },
                        {
                            label: 'Server',
                            valueField: 'server',
                            selected: true,
                            filter: {
                                isFilter: true,
                                type: 'contains',
                            },
                            isSort: true,
                        },
                        {
                            label: 'Instance',
                            valueField: 'instance',
                            selected: true,
                            filter: {
                                isFilter: true,
                                type: 'contains',
                            },
                            isSort: true,
                        },
                        {
                            label: 'Status Code',
                            valueField: 'statusCode',
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
            data: [
                {
                    tier: 'src/middleware',
                    server: 'setFavouriteToEachDC',
                    instance: 'instance 17',
                    statusCode: '200'
                }
            ]
        },
        {
            
            label: 'Request Headers',
            collapsed: true,
            headers: [
                {
                    cols: [
                        {
                            label: 'Tier',
                            valueField: 'tier',
                            selected: true,
                            filter: {
                                isFilter: true,
                                type: 'custom',
                            },
                            isSort: true,
                        },
                        {
                            label: 'Instance',
                            valueField: 'instance',
                            selected: true,
                            filter: {
                                isFilter: true,
                                type: 'custom',
                            },
                            isSort: true,
                        },
                    ],
                },
            ],
            data: [
                {
                    tier: 'cavndfpinstance',
                    instance: '4235785832_53278563875_7551.104',
                },
                {
                    tier: 'content-length',
                    instance: '389'
                },
                {
                    tier: 'HTTP Method',
                    instance: 'POST'
                },
                {
                    tier: 'host',
                    instance: 'cav-e-gr-atlanta-cols-atl-196.cav-test.com'
                },
                {
                    tier: 'content-type',
                    instance: 'application/json'
                },
                {
                    tier: 'connection',
                    instance: 'keep-alive'
                },
                {
                    tier: 'accept-encoding',
                    instance: 'gzip,deflate'
                },
                {
                    tier: 'accept',
                    instance: 'application/json'
                }
            ],
            paginator: {
                first: 1,
                rows: 10,
                rowsPerPageOptions: [10, 20,30, 50, 100],
            },
            tableFilter: false,
        },
        {
            
            label: 'Response Headers',
            collapsed: true,
            headers: [
                {
                    cols: [
                        {
                            label: 'Tier',
                            valueField: 'tier',
                            selected: true,
                            filter: {
                                isFilter: true,
                                type: 'custom',
                            },
                            isSort: true,
                        },
                        {
                            label: 'Instance',
                            valueField: 'instance',
                            selected: true,
                            filter: {
                                isFilter: true,
                                type: 'custom',
                            },
                            isSort: true,
                        },
                    ],
                },
            ],
            data: [
                {
                    tier: 'X-Frame-Options',
                    instance: 'SAMEORIGIN',

                },
                {
                    tier: 'Strict-Transport-Security',
                    instance: 'max-age=0'
                },
                {
                    tier: 'Access-Control-Allow-Origin',
                    instance: 'POST'
                },
                {
                    tier: 'X-Content-Type-Options',
                    instance: 'nosniff'
                },
                {
                    tier: 'content-type',
                    instance: '3689569834_9_1'
                },
                {
                    tier: 'Content-Security-Policy',
                    instance: 'default-src "self";img-src "self" ssl.google-analytics.com data:: script-src "self" ...'
                },
                {
                    tier: 'Set-Cookie',
                    instance: 'CavNV=63289563984579834-1-5-7-0-6-6:Path=/'
                },
                {
                    tier: 'X-XSS-Protection',
                    instance: '1; mode=block'
                }
            ],
            paginator: {
                first: 1,
                rows: 10,
                rowsPerPageOptions: [10, 20,30, 50, 100],
            },
            tableFilter: false,
        },
        {
            
            label: 'Custom Data',
            collapsed: true,
            headers: [
                {
                    cols: [
                        {
                            label: 'Tier',
                            valueField: 'tier',
                            selected: false,
                            filter: {
                                isFilter: true,
                                type: 'contains',
                            },
                            isSort: true,
                        },
                        {
                            label: 'Instance',
                            valueField: 'instance',

                            selected: true,
                            filter: {
                                isFilter: true,
                                type: 'custom',
                            },
                            isSort: true,
                        },
                    ],
                },
            ],
            data: [
                {
                    tier: 'No Record Found',
                    instance: 'No Record Found',
                },
            ],
            paginator: {
                first: 1,
                rows: 10,
                rowsPerPageOptions: [10, 20,30, 50, 100],
            },
            tableFilter: false,
        },
        {
           
            label: 'Session Data',
            collapsed: true,
            headers: [
                {
                    cols: [
                        {
                            label: 'Tier',
                            valueField: 'tier',
                            selected: true,
                            filter: {
                                isFilter: true,
                                type: 'custom',
                            },
                            isSort: true,
                        },
                        {
                            label: 'Instance',
                            valueField: 'instance',
                            selected: true,
                            filter: {
                                isFilter: true,
                                type: 'custom',
                            },
                            isSort: true,
                        },
                    ],
                },
            ],
            data: [
                {
                    tier: 'No Record Found',
                    instance: 'No Record Found',
                },
            ],
            paginator: {
                first: 1,
                rows: 10,
                rowsPerPageOptions: [10, 20,30, 50, 100],
            },
            tableFilter: false,
        },
        {
           
            label: 'Condition Data',
            collapsed: true,
            headers: [
                {
                    cols: [
                        {
                            label: 'Tier',
                            valueField: 'tier',
                            selected: true,
                            filter: {
                                isFilter: true,
                                type: 'custom',
                            },
                            isSort: true,
                        },
                        {
                            label: 'Instance',
                            valueField: 'instance',
                            selected: true,
                            filter: {
                                isFilter: true,
                                type: 'custom',
                            },
                            isSort: true,
                        },
                    ],
                },
            ],
            data: [
                {
                    tier: 'No Record Found',
                    instance: 'No Record Found',
                },
            ],
            paginator: {
                first: 1,
                rows: 10,
                rowsPerPageOptions: [10, 20,30, 50, 100],
            },
            tableFilter: false,
        },
    ],
};