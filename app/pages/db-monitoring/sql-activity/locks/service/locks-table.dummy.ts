import { Table } from "src/app/shared/table/table.model";


export const LOCKS_TABLE: Table = {

    paginator: {
        first: 1,
        rows: 10,
        rowsPerPageOptions: [10, 25, 50, 100],
    },
   
    headers: [
        {
            cols: [
                {
                    label: 'Process Id',
                    valueField: 'processId',
                    classes: 'text-left',
                    selected: true,
                    filter: {
                        isFilter: true,
                        type: 'contains',
                      },
                    isSort: true,
                },
                {
                    label: 'Database Name',
                    valueField: 'databaseName',
                    classes: 'text-left',
                    selected: true,
                    filter: {
                        isFilter: true,
                        type: 'contains',
                      },
                    isSort: true,
                },
                {
                    label: 'State Change Time',
                    valueField: 'stateChangeTime',
                    classes: 'text-left',
                    selected: true,
                    filter: {
                        isFilter: true,
                        type: 'contains',
                      },
                    isSort: true,
                },
                {
                    label: 'Resource Lock Type',
                    valueField: 'resourceLockType',
                    classes: 'text-left',
                    selected: true,
                    filter: {
                        isFilter: true,
                        type: 'contains',
                      },
                    isSort: true,
                },
                {
                    label: 'Lock Mode Name',
                    valueField: 'lockModeName',
                    classes: 'text-left',
                    selected: true,
                    filter: {
                        isFilter: true,
                        type: 'contains',
                      },
                    isSort: true,
                },
                {
                    label: 'Request Status',
                    valueField: 'requestStatus',
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
    data: [
        {
            processId: '29744',
            databaseName: 'Postgres',
            stateChangeTime: '2020-10-06 15:22:08',
            resourceLockType: 'Relation',
            lockModeName: 'AccessShareLock',
            requestStatus: 'Yes'
        },
        {
            processId: '29744',
            databaseName: 'Postgres',
            stateChangeTime: '2020-10-06 15:22:08',
            resourceLockType: 'Relation',
            lockModeName: 'AccessShareLock',
            requestStatus: 'Yes'
        },
        {
            processId: '29744',
            databaseName: 'Postgres',
            stateChangeTime: '2020-10-06 15:22:08',
            resourceLockType: 'Relation',
            lockModeName: 'AccessShareLock',
            requestStatus: 'Yes'
        },
        {
            processId: '29744',
            databaseName: 'Postgres',
            stateChangeTime: '2020-10-06 15:22:08',
            resourceLockType: 'Relation',
            lockModeName: 'AccessShareLock',
            requestStatus: 'Yes'
        },
        {
            processId: '29744',
            databaseName: 'Postgres',
            stateChangeTime: '2020-10-06 15:22:08',
            resourceLockType: 'Relation',
            lockModeName: 'AccessShareLock',
            requestStatus: 'Yes'
        },
        {
            processId: '29744',
            databaseName: 'Postgres',
            stateChangeTime: '2020-10-06 15:22:08',
            resourceLockType: 'Relation',
            lockModeName: 'AccessShareLock',
            requestStatus: 'Yes'
        },
        {
            processId: '29744',
            databaseName: 'Postgres',
            stateChangeTime: '2020-10-06 15:22:08',
            resourceLockType: 'Relation',
            lockModeName: 'AccessShareLock',
            requestStatus: 'Yes'
        },
        {
            processId: '29744',
            databaseName: 'Postgres',
            stateChangeTime: '2020-10-06 15:22:08',
            resourceLockType: 'Relation',
            lockModeName: 'AccessShareLock',
            requestStatus: 'Yes'
        },
        {
            processId: '29744',
            databaseName: 'Postgres',
            stateChangeTime: '2020-10-06 15:22:08',
            resourceLockType: 'Relation',
            lockModeName: 'AccessShareLock',
            requestStatus: 'Yes'
        },
        {
            processId: '29744',
            databaseName: 'Postgres',
            stateChangeTime: '2020-10-06 15:22:08',
            resourceLockType: 'Relation',
            lockModeName: 'AccessShareLock',
            requestStatus: 'Yes'
        },
        {
            processId: '29744',
            databaseName: 'Postgres',
            stateChangeTime: '2020-10-06 15:22:08',
            resourceLockType: 'Relation',
            lockModeName: 'AccessShareLock',
            requestStatus: 'Yes'
        },
        {
            processId: '29744',
            databaseName: 'Postgres',
            stateChangeTime: '2020-10-06 15:22:08',
            resourceLockType: 'Relation',
            lockModeName: 'AccessShareLock',
            requestStatus: 'Yes'
        },
        {
            processId: '29744',
            databaseName: 'Postgres',
            stateChangeTime: '2020-10-06 15:22:08',
            resourceLockType: 'Relation',
            lockModeName: 'AccessShareLock',
            requestStatus: 'Yes'
        },
        {
            processId: '29744',
            databaseName: 'Postgres',
            stateChangeTime: '2020-10-06 15:22:08',
            resourceLockType: 'Relation',
            lockModeName: 'AccessShareLock',
            requestStatus: 'Yes'
        },
        {
            processId: '29744',
            databaseName: 'Postgres',
            stateChangeTime: '2020-10-06 15:22:08',
            resourceLockType: 'Relation',
            lockModeName: 'AccessShareLock',
            requestStatus: 'Yes'
        },
        {
            processId: '29744',
            databaseName: 'Postgres',
            stateChangeTime: '2020-10-06 15:22:08',
            resourceLockType: 'Relation',
            lockModeName: 'AccessShareLock',
            requestStatus: 'Yes'
        },
        {
            processId: '29744',
            databaseName: 'Postgres',
            stateChangeTime: '2020-10-06 15:22:08',
            resourceLockType: 'Relation',
            lockModeName: 'AccessShareLock',
            requestStatus: 'Yes'
        },
        {
            processId: '29744',
            databaseName: 'Postgres',
            stateChangeTime: '2020-10-06 15:22:08',
            resourceLockType: 'Relation',
            lockModeName: 'AccessShareLock',
            requestStatus: 'Yes'
        },

    ],
};