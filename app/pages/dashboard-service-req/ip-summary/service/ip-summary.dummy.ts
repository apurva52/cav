import { IpSummaryData } from './ip-summary.model';

export const IP_SUMMARY_DUMMY: IpSummaryData = {
    panels: [
        {
            sort: {
                fields: [
                    'field1',
                    'field2',
                    'field3',
                    'field4',
                    'field5',
                    'field6',
                    'field7',
                    'field8',
                    'field9',
                    'field10',
                ],
            },

            paginator: {
                first: 1,
                rows: 10,
                rowsPerPageOptions: [10, 20,30, 50, 100],
            },
            tableFilter: false,

            label: 'BT Callout Summary',
            collapsed: false,
            menuOption: false,
            headers: [
                {
                    cols: [
                        {
                            label: 'Business Transaction',
                            valueField: 'field1',
                            selected: true,
                            filter: {
                                isFilter: true,
                                type: 'contains',
                            },
                            isSort: true,
                        },
                        {
                            label: 'Min http Callout',
                            valueField: 'field2',
                            selected: true,
                            filter: {
                                isFilter: true,
                                type: 'contains',
                            },
                            isSort: true,
                        },
                        {
                            label: 'Max http Callout',
                            valueField: 'field3',
                            selected: true,
                            filter: {
                                isFilter: true,
                                type: 'contains',
                            },
                            isSort: true,
                        },
                        {
                            label: 'Total http Callout',
                            valueField: 'field4',
                            selected: true,
                            filter: {
                                isFilter: true,
                                type: 'contains',
                            },
                            isSort: true,
                        },
                        {
                            label: 'Min DB Callout',
                            valueField: 'field5',
                            selected: true,
                            filter: {
                                isFilter: true,
                                type: 'contains',
                            },
                            isSort: true,
                        },
                        {
                            label: 'Max DB Callout',
                            valueField: 'field6',
                            selected: true,
                            filter: {
                                isFilter: true,
                                type: 'contains',
                            },
                            isSort: true,
                        },
                        {
                            label: 'Total DB Callout',
                            valueField: 'field7',
                            selected: true,
                            filter: {
                                isFilter: true,
                                type: 'contains',
                            },
                            isSort: true,
                        },
                        {
                            label: 'Min Callout',
                            valueField: 'field8',
                            selected: true,
                            filter: {
                                isFilter: true,
                                type: 'contains',
                            },
                            isSort: true,
                        },
                        {
                            label: 'Max Callout',
                            valueField: 'field9',
                            selected: true,
                            filter: {
                                isFilter: true,
                                type: 'contains',
                            },
                            isSort: true,
                        },
                        {
                            label: 'Flowapth(s)',
                            valueField: 'field10',
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
                    field1: 'Coyote_Adapter',
                    field2: '0',
                    field3: '0',
                    field4: '[Anonymous]',
                    field5: '[Anonymous]',
                    field6: '19,232',
                    field7: '0.01',
                    field8: '13',
                    field9: '3',
                    field10: '1'
                },
                {
                    field1: 'Coyote_Adapter',
                    field2: '0',
                    field3: '0',
                    field4: '[Anonymous]',
                    field5: '[Anonymous]',
                    field6: '19,232',
                    field7: '0.01',
                    field8: '13',
                    field9: '3',
                    field10: '1'
                },
                {
                    field1: 'Coyote_Adapter',
                    field2: '0',
                    field3: '0',
                    field4: '[Anonymous]',
                    field5: '[Anonymous]',
                    field6: '19,232',
                    field7: '0.01',
                    field8: '13',
                    field9: '6',
                    field10: '1'
                },
                {
                    field1: 'Coyote_Adapter',
                    field2: '0',
                    field3: '0',
                    field4: '[Anonymous]',
                    field5: '[Anonymous]',
                    field6: '19,232',
                    field7: '0.01',
                    field8: '13',
                    field9: '3',
                    field10: '1'
                },
                {
                    field1: 'Coyote_Adapter',
                    field2: '0',
                    field3: '0',
                    field4: '[Anonymous]',
                    field5: '[Anonymous]',
                    field6: '19,232',
                    field7: '0.01',
                    field8: '13',
                    field9: '3',
                    field10: '1'
                },
                {
                    field1: 'Coyote_Adapter',
                    field2: '0',
                    field3: '0',
                    field4: '[Anonymous]',
                    field5: '[Anonymous]',
                    field6: '19,232',
                    field7: '0.01',
                    field8: '13',
                    field9: '3',
                    field10: '1'
                },

            ]
        },

        {
            sort: {
                fields: [
                    'field1',
                    'field2',
                    'field3',
                    'field4',
                    'field5',
                    'field6',
                    'field7',
                    'field8',
                    'field9',
                    'field10',
                    'field11',
                    'field12',
                    'field13',
                ],
            },

            paginator: {
                first: 1,
                rows: 33,
                rowsPerPageOptions: [3, 5, 10, 25, 50, 100],
            },
            tableFilter: false,
            label: 'BT Callout Details',
            collapsed: true,
            menuOption: false,
            headers: [
                {
                    cols: [
                        {
                            label: 'Integration Point',
                            valueField: 'field1',
                            selected: true,
                            filter: {
                                isFilter: true,
                                type: 'contains',
                            },
                            isSort: true,
                        },
                        {
                            label: 'Discovered Name',
                            valueField: 'field2',
                            selected: true,
                            filter: {
                                isFilter: true,
                                type: 'contains',
                            },
                            isSort: true,
                        },
                        {
                            label: 'Type',
                            valueField: 'field3',
                            selected: true,
                            filter: {
                                isFilter: true,
                                type: 'contains',
                            },
                            isSort: true,
                        },
                        {
                            label: 'Total Duration',
                            valueField: 'field4',
                            selected: true,
                            filter: {
                                isFilter: true,
                                type: 'contains',
                            },
                            isSort: true,
                        },
                        {
                            label: 'Average Duration',
                            valueField: 'field5',
                            selected: true,
                            filter: {
                                isFilter: true,
                                type: 'contains',
                            },
                            isSort: true,
                        },
                        {
                            label: 'Max Duration',
                            valueField: 'field6',
                            selected: true,
                            filter: {
                                isFilter: true,
                                type: 'contains',
                            },
                            isSort: true,
                        },
                        {
                            label: 'Min Duration',
                            valueField: 'field7',
                            selected: true,
                            filter: {
                                isFilter: true,
                                type: 'contains',
                            },
                            isSort: true,
                        },
                        {
                            label: 'Total Count',
                            valueField: 'field8',
                            selected: true,
                            filter: {
                                isFilter: true,
                                type: 'contains',
                            },
                            isSort: true,
                        },
                        {
                            label: 'Min Count',
                            valueField: 'field9',
                            selected: true,
                            filter: {
                                isFilter: true,
                                type: 'contains',
                            },
                            isSort: true,
                        },
                        {
                            label: 'Max Count',
                            valueField: 'field10',
                            selected: true,
                            filter: {
                                isFilter: true,
                                type: 'contains',
                            },
                            isSort: true,
                        },
                        {
                            label: 'Error(s)',
                            valueField: 'field11',
                            selected: true,
                            filter: {
                                isFilter: true,
                                type: 'contains',
                            },
                            isSort: true,
                        },
                        {
                            label: 'Avg Network Delay',
                            valueField: 'field12',
                            selected: true,
                            filter: {
                                isFilter: true,
                                type: 'contains',
                            },
                            isSort: true,
                        },
                        {
                            label: 'Total Network Delay',
                            valueField: 'field13',
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
            data: [
                {
                    field1: 'sdas',
                    field2: '24.23354',
                    field3: 'HTTP',
                    field4: '1,093 ',
                    field5: '1,093',
                    field6: '2568.191',
                    field7: '3244.123',
                    field8: '1',
                    field9: '1',
                    field10: '0',
                    field11: '4',
                    field12: '4',
                    field13: '1'
                },
                {
                    field1: 'sdas',
                    field2: '24.23354',
                    field3: 'HTTP',
                    field4: '1,093 ',
                    field5: '1,093',
                    field6: '2568.191',
                    field7: '3244.123',
                    field8: '1',
                    field9: '1',
                    field10: '0',
                    field11: '4',
                    field12: '4',
                    field13: '1'
                },
                {
                    field1: 'sdas',
                    field2: '24.23354',
                    field3: 'HTTP',
                    field4: '1,093 ',
                    field5: '1,093',
                    field6: '2568.191',
                    field7: '3244.123',
                    field8: '1',
                    field9: '1',
                    field10: '0',
                    field11: '4',
                    field12: '4',
                    field13: '1'
                },
                {
                    field1: 'sdas',
                    field2: '24.23354',
                    field3: 'HTTP',
                    field4: '1,093 ',
                    field5: '1,093',
                    field6: '2568.191',
                    field7: '3244.123',
                    field8: '1',
                    field9: '1',
                    field10: '0',
                    field11: '4',
                    field12: '4',
                    field13: '1'
                },
            ]
        }
    ],
};
