import { CleanupTable, CustomPathTable } from "./global-configuration.model";



export const CLEANUP_TABLE: CleanupTable = {
    paginator: {
        first: 1,
        rows: 10,
        rowsPerPageOptions: [3, 5, 10, 25, 50, 100],
    },
    headers: [
        {
            cols: [
                {
                    label: 'Component Name',
                    valueField: 'cName',
                    classes: 'text-left',
                    selected: true,
                    filter: {
                        isFilter: true,
                        type: 'contains',
                      },
                      isSort: true,
                      actionIcon: false
                },
                {
                    label: 'Date',
                    valueField: 'date',
                    classes: 'text-left',
                    selected: true,
                    filter: {
                        isFilter: true,
                        type: 'contains',
                      },
                      isSort: true,
                      actionIcon: true
                }

            ],
        },
    ],
    data: [
        {
            cName: 'Metric Data',
            icon: 'icons8 icons8-edit',
            date: '07/15/20',
        },
        {
            cName: 'Metric Data',
            icon: 'icons8 icons8-edit',
            date: '07/15/20',
        },
        {
            cName: 'Metric Data',
            icon: 'icons8 icons8-edit',
            date: '07/15/20',
        },
        {
            cName: 'Metric Data',
            icon: 'icons8 icons8-edit',
            date: '07/15/20',
        },
        

    ],
    tableFilter: true,
};

export const CUSTOMPATH_TABLE: CustomPathTable = {
    paginator: {
        first: 1,
        rows: 10,
        rowsPerPageOptions: [3, 5, 10, 25, 50, 100],
    },
    headers: [
        {
            cols: [
                {
                    label: 'Component Name',
                    valueField: 'cName',
                    classes: 'text-left',
                    selected: true,
                    filter: {
                        isFilter: true,
                        type: 'contains',
                      },
                      isSort: true,
                      actionIcon: false
                },
                {
                    label: 'Date',
                    valueField: 'date',
                    classes: 'text-left',
                    selected: true,
                    filter: {
                        isFilter: true,
                        type: 'contains',
                      },
                      isSort: true,
                      actionIcon: true
                }

            ],
        },
    ],
    data: [
        {
            cName: 'Metric Data',
            icon: 'icons8 icons8-edit',
            date: '07/15/20',
        },
        {
            cName: 'Metric Data',
            icon: 'icons8 icons8-edit',
            date: '07/15/20',
        },
        {
            cName: 'Metric Data',
            icon: 'icons8 icons8-edit',
            date: '08/15/20',
        },
        {
            cName: 'Metric Data',
            icon: 'icons8 icons8-edit',
            date: '08/15/20',
        },
        

    ],
    tableFilter: true,
};
