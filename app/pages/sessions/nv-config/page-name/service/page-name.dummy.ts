import { Table } from "src/app/shared/table/table.model";

export const PAGE_NAME_DATA: Table = {

    paginator: {
        first: 1,
        rows: 10,
        rowsPerPageOptions: [10, 20, 50, 100],
    },


    headers: [
        {
            cols: [
                {
                    label: 'Page Name',
                    valueField: 'name',
                    classes: 'text-left',
                    isSort: true,
                    filter: {
                        isFilter: true,
                        type: 'contains',
                    },
                    selected: true,
                    width: '25%', 
                    
                },
                {
                    label: 'Method Definition',
                    valueField: 'tPageMethod',
                    classes: 'text-left',
                    isSort: true,
                    filter: {
                        isFilter: true,
                        type: 'contains',
                    },
                    selected: true,
                    width: '25%'
                },
                {
                    label: 'Parameters',
                    valueField: 'pattern',
                    classes: 'text-left',
                    isSort: true,
                    filter: {
                        isFilter: true,
                        type: 'contains',
                    },
                    selected: true,
                    width: '25%'
                },
                {
                    label: 'Variable Name',
                    valueField: 'variableName',
                    classes: 'text-left',
                    isSort: true,
                    filter: {
                        isFilter: true,
                        type: 'contains',
                    },
                    selected: true,
                    width: '25%'
                },
                // {
                //     label: 'Action',
                //     valueField: 'actionIcon',
                //     classes: 'text-center',
                //     isSort: false,
                //     filter: {
                //         isFilter: false,
                //         type: 'contains',
                //     },
                //     selected: true,
                //     iconField: true,
                //     width: '5%'
                // }
            ],
        },
    ],
    data: [
    ],
};
