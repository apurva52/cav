import { allocationTable } from './allocation.model';
export const allocation_NAME_DATA: allocationTable = {

    paginator: {
        first: 1,
        rows: 10,
        rowsPerPageOptions: [10, 20, 50, 100],
    },
    headers: [
        {
            cols: [ 
                {
                    label: 'SL NO',
                    valueField: 'sl',
                    classes: 'text-right',
                    isSort: true,
                    selected: true, 
                    width:"4%",
                    filter: {
                        isFilter: true,
                        type: 'contains',
                    }

                },
                {
                    label: 'User',
                    valueField: 'User',
                    classes: 'text-left',
                    isSort: true,
                    selected: true, 
                    width: "5%",
                    filter: {
                        isFilter: true,
                        type: 'contains',
                    }

                },
                {
                    label: 'Time Stamp',
                    valueField: 'Stamp',
                    classes: 'text-right',
                    isSort: true,
                    selected: true, 
                    width: "5%",
                    filter: {
                        isFilter: true,
                        type: 'contains',
                    }

                },
                {
                    label: 'Comments',
                    valueField: 'Comments',
                    classes: 'text-left',
                    isSort: true,
                    selected: true, 
                    width: "25%",
                    filter: {
                        isFilter: true,
                        type: 'contains',
                    }

                },
               
            ]

        }
    ],
    data: [ 
       
    ]
}
