import { MvendersTable } from './mang-vendes.model';

export const Mvenders_NAME_DATA: MvendersTable = {

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
                    valueField: 'seq',
                    classes: 'text-right',
                    isSort: true,
                    filter: {
                        isFilter: true,
                        type: 'contains',
                    },
                    selected: true,
                    width: '5%'
                }, 
                {
                    label: 'Vendors',
                    valueField: 'name',
                    classes: 'text-right',
                    isSort: true,
                    filter: {
                        isFilter: true,
                        type: 'contains',
                    },
                    selected: true,
                    width: '5%'
                }, 
                {
                    label: 'Server Count',
                    valueField: 'serverCount',
                    classes: 'text-right',
                    isSort: true,
                    filter: {
                        isFilter: true,
                        type: 'contains',
                    },
                    selected: true,
                    width: '5%'
                }, 
                
            ] 
        } 
    ],
    data:[ 
    ] 
}