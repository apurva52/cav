import { multiNodeConfigTable } from "./multi-node-configuration.model";

export const MULTI_NODE_CONFIG_STATS_TABLE: multiNodeConfigTable = {

        paginator: {
            first: 1,
            rows: 10,
            rowsPerPageOptions: [10, 25, 50, 100],
        },

        headers: [
            {
                cols: [
                    {
                        label: 'Node Name',
                        valueField: 'dc',
                        classes: 'text-left',
                        selected: true,
                        filter: {
                            isFilter: true,
                            type: 'contains',
                        },
                        isSort: true,
                    },
                    {
                        label: 'Session Number',
                        valueField: 'testRun',
                        classes: 'text-left',
                        selected: true,
                        filter: {
                            isFilter: true,
                            type: 'contains',
                        },
                        isSort: true,
                    },
                    {
                        label: 'IP Address',
                        valueField: 'ip',
                        classes: 'text-left',
                        selected: true,
                        filter: {
                            isFilter: true,
                            type: 'contains',
                        },
                        isSort: true,
                    },
                    {
                        label: 'Port',
                        valueField: 'port',
                        classes: 'text-left',
                        selected: true,
                        filter: {
                            isFilter: true,
                            type: 'contains',
                        },
                        isSort: true,
                    },
                    {
                        label: 'Protocol',
                        valueField: 'protocol',
                        classes: 'text-left',
                        selected: true,
                        filter: {
                            isFilter: true,
                            type: 'contains',
                        },
                        isSort: true,
                    },
                    {
                        label: 'Master',
                        valueField: 'isMaster',
                        classes: 'text-left',
                        selected: true,
                        filter: {
                            isFilter: true,
                            type: 'contains',
                        },
                        isSort: true,
                        iconField: true,
                    },
                    {
                        label: 'Product Type',
                        valueField: 'productType',
                        classes: 'text-left',
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
        // data: [
        //     {
        //         nodename: 'NC-MON',
        //         no: '1111',
        //         ipaddress: 'nomon1.cav-test.com',
        //         port: '4433',
        //         protocol: 'https',
        //         icon: 'icons8 icons8-checkmark',
        //         producttypes: 'netvision',
        //         kml: "abc"

        //     },
        //     {
        //         nodename: 'NCMON_AGENT_NV',
        //         no: '4444',
        //         ipaddress: 'nomon1.wes-test.com',
        //         port: '4443',
        //         protocol: 'https',
        //         icon: 'icons8 icons8-checkmark',
        //         producttypes: 'netdaignostic',
        //         vaibhav: "abc"

        //     }
        // ],
    }


