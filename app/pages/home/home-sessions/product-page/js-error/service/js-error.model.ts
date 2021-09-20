import { Table } from "src/app/shared/table/table.model";


export const JSERROR_DATA: Table = {
    paginator: {
        first: 1,
        rows: 10,
        rowsPerPageOptions: [5, 10, 25, 50, 100],
    },

    headers: [
        {
            cols: [
                {
                    label: 'Time',
                    valueField: 'timestamp',
                    classes: 'text-right',
                    selected: true,
                    filter: {
                        isFilter: true,
                        type: 'contains',
                    },
                    isSort: true,
                },
                {
                    label: 'Error Message',
                    valueField: 'message',
                    classes: 'text-left',
                    selected: true,
                    filter: {
                        isFilter: true,
                        type: 'contains',
                    },
                    isSort: true,
                },
                {
                    label: 'JS File',
                    valueField: 'file',
                    classes: 'text-left',
                    selected: true,
                    filter: {
                        isFilter: true,
                        type: 'contains',
                    },
                    isSort: true,
                },
                {
                    label: 'Line',
                    valueField: 'lineNumber',
                    classes: 'text-right',
                    selected: true,
                    filter: {
                        isFilter: true,
                        type: 'contains',
                    },
                    isSort: true,
                },
                {
                    label: 'Column',
                    valueField: 'col',
                    classes: 'text-right',
                    selected: true,
                    filter: {
                        isFilter: true,
                        type: 'contains',
                    },
                    isSort: true,
                }
            ]
        }
    ],
    data: []
};

export interface StackTrace {
    type: number;
    text: string;
    file?: string;
    url?: string;
}

