import { Table } from "../../../../../shared/table/table.model";
import { pvoitNameTable } from './pvoit-table.model';


export const Pvoit_NAME_DATA: pvoitNameTable = {

    paginator: {
        first: 1,
        rows: 10,
        rowsPerPageOptions: [10, 20, 50, 100],
    },


    headers: [
        {
            cols: [ 
                {
                    label: '#',
                    valueField: 'eventcounter',
                    classes: 'text-right',
                    isSort: true,

                    selected: true,
                    width: '5%',
                    filter: {
                        isFilter: true,
                        type: 'contains',
                    }
                },
                {
                    label: 'Team',
                    valueField: 'team',
                    classes: 'text-left',
                    isSort: true,

                    selected: true,
                    width: '5%',
                    filter: {
                        isFilter: true,
                        type: 'contains',
                    }
                },
                {
                    label: 'Controller',
                    valueField: 'totalController',
                    classes: 'text-right',
                    isSort: true,

                    selected: true,
                    width: '5%',
                    filter: {
                        isFilter: true,
                        type: 'contains',
                    }
                },
                {
                    label: 'Generator',
                    valueField: 'totalGenerator',
                    classes: 'text-right',
                    isSort: true,

                    selected: true,
                    width: '5%',
                    filter: {
                        isFilter: true,
                        type: 'contains',
                    }
                },
                {
                    label: 'Netstrom',
                    valueField: 'totalNetstorm',
                    classes: 'text-right',
                    isSort: true,

                    selected: true,

                    width: '5%',
                    filter: {
                        isFilter: true,
                        type: 'contains',
                    }
                },
                {
                    label: 'Netocean',
                    valueField: 'totalNetocean',
                    classes: 'text-right',
                    isSort: true,

                    selected: true,

                    width: '5%',
                    filter: {
                        isFilter: true,
                        type: 'contains',
                    }
                },
                {
                    label: 'Total',
                    valueField: 'total',
                    classes: 'text-right',
                    isSort: true,

                    selected: true,

                    width: '5%',
                    filter: {
                        isFilter: true,
                        type: 'contains',
                    }
                }
            ],
        },
    ],
    data: [      

    ] 
}