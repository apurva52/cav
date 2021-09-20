import { ExceptionData } from './exception.model';
export const EXCEPTION_DUMMY: ExceptionData = {
    panels: [
        {
            paginator: {
                first: 1,
                rows: 3,
                rowsPerPageOptions: [3, 5, 10, 25, 50, 100],
            },


            label: 'Aggregate Exception',
            collapsed: false,
            headers: [
                {
                    cols: [
                        {
                            label: 'Exception Class',
                            valueField: 'field1',
                            selected: true,
                            filter: {
                                isFilter: true,
                                type: 'contains',
                            },
                            isSort: true,
                        },
                        {
                            label: 'Throwing Class',
                            valueField: 'field2',
                            selected: true,
                            filter: {
                                isFilter: true,
                                type: 'contains',
                            },
                            isSort: true,
                        },
                        {
                            label: 'Throwing Method',
                            valueField: 'field3',
                            selected: true,
                            filter: {
                                isFilter: true,
                                type: 'contains',
                            },
                            isSort: true,
                        },
                        {
                            label: 'Exception Count',
                            valueField: 'field4',
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
                    field1: 'java.sql.SQLException',
                    field2: 'org.apache.dbcp.PoolableConnection1',
                    field3: 'Close',
                    field4: '1'
                },
                {
                    field1: 'java.sql.SQLException',
                    field2: 'org.apache.dbcp.PoolableConnection2',
                    field3: 'Close',
                    field4: '1'
                },
                {
                    field1: 'java.sql.SQLException',
                    field2: 'org.apache.dbcp.PoolableConnection3',
                    field3: 'Close',
                    field4: '1'
                },
                {
                    field1: 'java.sql.SQLException',
                    field2: 'org.apache.dbcp.PoolableConnection4',
                    field3: 'Close',
                    field4: '1'
                }
            ],
            tableFilter: false,
        },
        {
            paginator: {
                first: 1,
                rows: 33,
                rowsPerPageOptions: [3, 5, 10, 25, 50, 100],
            },

            label: 'Exception',
            collapsed: true,
            headers: [
                {
                    cols: [
                        {
                            label: 'Tier',
                            valueField: 'field1',
                            selected: true,
                            filter: {
                                isFilter: true,
                                type: 'contains',
                            },
                            isSort: true,
                        },
                        {
                            label: 'Instance',
                            valueField: 'field2',
                            selected: true,
                            filter: {
                                isFilter: true,
                                type: 'contains',
                            },
                            isSort: true,
                        },
                        {
                            label: 'Integration Point',
                            valueField: 'field3',
                            selected: true,
                            filter: {
                                isFilter: true,
                                type: 'contains',
                            },
                            isSort: true,
                        },
                        {
                            label: 'Time',
                            valueField: 'field4',
                            selected: true,
                            filter: {
                                isFilter: true,
                                type: 'contains',
                            },
                            isSort: true,
                        },
                        {
                            label: 'Exception Class',
                            valueField: 'field5',
                            selected: true,
                            filter: {
                                isFilter: true,
                                type: 'contains',
                            },
                            isSort: true,
                        },
                        {
                            label: 'Message',
                            valueField: 'field6',
                            selected: true,
                            filter: {
                                isFilter: true,
                                type: 'contains',
                            },
                            isSort: true,
                        },
                        {
                            label: 'Throwing Class',
                            valueField: 'field7',
                            selected: true,
                            filter: {
                                isFilter: true,
                                type: 'contains',
                            },
                            isSort: true,
                        },
                        {
                            label: 'Throwing Method',
                            valueField: 'field8',
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
                    field1: 'NDMonitor 23123',
                    field2: 'Instance 12',
                    field3: '',
                    field4: '09/28/2020 12:59',
                    field5: 'SQL Exception',
                    field6: 'Already Closed',
                    field7: 'org.apache.common.db',
                    field8: 'close'
                },
                {
                    field1: 'NDMonitor 23123',
                    field2: 'Instance 12',
                    field3: '',
                    field4: '09/28/2020 12:59',
                    field5: 'SQL Exception',
                    field6: 'Already Closed',
                    field7: 'org.apache.common.db',
                    field8: 'close'
                },
                {
                    field1: 'NDMonitor 23123',
                    field2: 'Instance 12',
                    field3: '',
                    field4: '09/28/2020 12:59',
                    field5: 'SQL Exception',
                    field6: 'Already Closed',
                    field7: 'org.apache.common.db',
                    field8: 'close'
                }

            ],
            tableFilter: false,
        },
        {
            paginator: {
                first: 1,
                rows: 33,
                rowsPerPageOptions: [3, 5, 10, 25, 50, 100],
            },

            label: 'Stack Trace',
            collapsed: true,
            headers: [
                {
                    cols: [
                        {
                            label: 'Stack trace',
                            valueField: 'field1',
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
                    field1: 'CartModifierFromHandler.addItemToOrder {CartModifierFormHandler.java:2900}'
                },
                {
                    field1: 'CartModifierFromHandler.addItemToOrder {CartModifierFormHandler.java:2900}'
                },
                {
                    field1: 'CartModifierFromHandler.addItemToOrder {CartModifierFormHandler.java:2900}'
                },
                {
                    field1: 'CartModifierFromHandler.addItemToOrder {CartModifierFormHandler.java:2900}'
                },
                {
                    field1: 'CartModifierFromHandler.addItemToOrder {CartModifierFormHandler.java:2900}'
                }
            ],
            tableFilter: false,
        }
    ],
};