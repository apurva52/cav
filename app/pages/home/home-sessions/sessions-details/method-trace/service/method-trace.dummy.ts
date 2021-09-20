import { methodTraceTable } from "./method-trace.model";


export const METHOD_TRACE_TABLE: methodTraceTable = {
    methodCollectionTree: {
        paginator: {
            first: 1,
            rows: 10,
            rowsPerPageOptions: [10, 25, 50, 100],
        },

        headers: [
            {
                cols: [
                    {
                        label: 'Method Name',
                        valueField: 'methodName',
                        classes: 'text-left',
                        selected: true,
                        filter: {
                            isFilter: true,
                            type: 'contains',
                        },
                        isSort: true,
                    },
                    {
                        label: 'Self Duration (ms)',
                        valueField: 'selfDuration',
                        classes: 'text-left',
                        selected: true,
                        filter: {
                            isFilter: true,
                            type: 'contains',
                        },
                        isSort: true,
                    },
                    {
                        label: 'Wall Duration (ms)',
                        valueField: 'wallDuration',
                        classes: 'text-left',
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
                methodName: 'CC-W-CA-Fremont-HE',
                selfDuration: '2589.191',
                wallDuration: '1'
            },
            {
                methodName: 'CC-W-CA-Fremont-HE',
                selfDuration: '2589.191',
                wallDuration: '1'
            },
            {
                methodName: 'CC-W-CA-Fremont-HE',
                selfDuration: '2589.191',
                wallDuration: '1'
            },
            {
                methodName: 'CC-W-CA-Fremont-HE',
                selfDuration: '2589.191',
                wallDuration: '1'
            },
            {
                methodName: 'CC-W-CA-Fremont-HE',
                selfDuration: '2589.191',
                wallDuration: '1'
            },
            {
                methodName: 'CC-W-CA-Fremont-HE',
                selfDuration: '2589.191',
                wallDuration: '1'
            },
            {
                methodName: 'CC-W-CA-Fremont-HE',
                selfDuration: '2589.191',
                wallDuration: '1'
            },
            {
                methodName: 'CC-W-CA-Fremont-HE',
                selfDuration: '2589.191',
                wallDuration: '1'
            },
            {
                methodName: 'CC-W-CA-Fremont-HE',
                selfDuration: '2589.191',
                wallDuration: '1'
            },
            {
                methodName: 'CC-W-CA-Fremont-HE',
                selfDuration: '2589.191',
                wallDuration: '1'
            },
            {
                methodName: 'CC-W-CA-Fremont-HE',
                selfDuration: '2589.191',
                wallDuration: '1'
            },
            {
                methodName: 'CC-W-CA-Fremont-HE',
                selfDuration: '2589.191',
                wallDuration: '1'
            },
            {
                methodName: 'CC-W-CA-Fremont-HE',
                selfDuration: '2589.191',
                wallDuration: '1'
            },
            {
                methodName: 'CC-W-CA-Fremont-HE',
                selfDuration: '2589.191',
                wallDuration: '1'
            },
            {
                methodName: 'CC-W-CA-Fremont-HE',
                selfDuration: '2589.191',
                wallDuration: '1'
            },
            {
                methodName: 'CC-W-CA-Fremont-HE',
                selfDuration: '2589.191',
                wallDuration: '1'
            },
            {
                methodName: 'CC-W-CA-Fremont-HE',
                selfDuration: '2589.191',
                wallDuration: '1'
            },
            {
                methodName: 'CC-W-CA-Fremont-HE',
                selfDuration: '2589.191',
                wallDuration: '1'
            },

        ],
    },

    methodTimingTable: {
        paginator: {
            first: 1,
            rows: 10,
            rowsPerPageOptions: [10, 25, 50, 100],
        },

        headers: [
            {
                cols: [
                    {
                        label: 'Method Name',
                        valueField: 'methodName',
                        classes: 'text-left',
                        selected: true,
                        filter: {
                            isFilter: true,
                            type: 'contains',
                        },
                        isSort: true,
                    },
                    {
                        label: 'Count',
                        valueField: 'count',
                        classes: 'text-left',
                        selected: true,
                        filter: {
                            isFilter: true,
                            type: 'contains',
                        },
                        isSort: true,
                    },
                    {
                        label: 'Self Duration (ms)',
                        valueField: 'selfDuration',
                        classes: 'text-left',
                        selected: true,
                        filter: {
                            isFilter: true,
                            type: 'contains',
                        },
                        isSort: true,
                    },
                    {
                        label: 'Wall Duration (ms)',
                        valueField: 'wallDuration',
                        classes: 'text-left',
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
                methodName: 'CC-W-CA-Fremont-HE',
                count: '2589.191',
                selfDuration: '2589.191',
                wallDuration: '1'
            },
            {
                methodName: 'CC-W-CA-Fremont-HE',
                count: '2589.191',
                selfDuration: '2589.191',
                wallDuration: '1'
            },
            {
                methodName: 'CC-W-CA-Fremont-HE',
                count: '2589.191',
                selfDuration: '2589.191',
                wallDuration: '1'
            },
            {
                methodName: 'CC-W-CA-Fremont-HE',
                count: '2589.191',
                selfDuration: '2589.191',
                wallDuration: '1'
            },
            {
                methodName: 'CC-W-CA-Fremont-HE',
                count: '2589.191',
                selfDuration: '2589.191',
                wallDuration: '1'
            },
            {
                methodName: 'CC-W-CA-Fremont-HE',
                count: '2589.191',
                selfDuration: '2589.191',
                wallDuration: '1'
            },
            {
                methodName: 'CC-W-CA-Fremont-HE',
                count: '2589.191',
                selfDuration: '2589.191',
                wallDuration: '1'
            },
            {
                methodName: 'CC-W-CA-Fremont-HE',
                count: '2589.191',
                selfDuration: '2589.191',
                wallDuration: '1'
            },
            {
                methodName: 'CC-W-CA-Fremont-HE',
                count: '2589.191',
                selfDuration: '2589.191',
                wallDuration: '1'
            },
            {
                methodName: 'CC-W-CA-Fremont-HE',
                count: '2589.191',
                selfDuration: '2589.191',
                wallDuration: '1'
            },
            {
                methodName: 'CC-W-CA-Fremont-HE',
                count: '2589.191',
                selfDuration: '2589.191',
                wallDuration: '1'
            },
            {
                methodName: 'CC-W-CA-Fremont-HE',
                count: '2589.191',
                selfDuration: '2589.191',
                wallDuration: '1'
            },
            {
                methodName: 'CC-W-CA-Fremont-HE',
                count: '2589.191',
                selfDuration: '2589.191',
                wallDuration: '1'
            },
            {
                methodName: 'CC-W-CA-Fremont-HE',
                count: '2589.191',
                selfDuration: '2589.191',
                wallDuration: '1'
            },
            {
                methodName: 'CC-W-CA-Fremont-HE',
                count: '2589.191',
                selfDuration: '2589.191',
                wallDuration: '1'
            },
            {
                methodName: 'CC-W-CA-Fremont-HE',
                count: '2589.191',
                selfDuration: '2589.191',
                wallDuration: '1'
            },
            {
                methodName: 'CC-W-CA-Fremont-HE',
                count: '2589.191',
                selfDuration: '2589.191',
                wallDuration: '1'
            },
            {
                methodName: 'CC-W-CA-Fremont-HE',
                count: '2589.191',
                selfDuration: '2589.191',
                wallDuration: '1'
            },

        ],
    },
};


export const PANEL_DUMMY: any = {
    panels: [
        { label: '', collapsed: false },
        { label: '', collapsed: false },
    ],
};

