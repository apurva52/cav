import { VendersTable } from './nsm-venders.model';

export const Vanders_NAME_DATA: VendersTable = {

    paginator: {
        first: 1,
        rows: 10,
        rowsPerPageOptions: [10, 20, 50, 100],
    },
    headers: [
        {
            cols: [ 
                {
                    label: 'Sl No',
                    valueField: 'seq',
                    classes: 'text-right',
                    isSort: true,
                    selected: true,
                    filter: {
                        isFilter: true,
                        type: 'contains',
                    }

                }, 
                {
                    label: 'Vandor Name',
                    valueField: 'name',
                    classes: 'text-right',
                    isSort: true,
                    selected: true,
                    filter: {
                        isFilter: true,
                        type: 'contains',
                    }

                },
                {
                    label: 'Servers Count',
                    valueField: 'serverCount',
                    classes: 'text-right',
                    isSort: true,
                    selected: true,
                    filter: {
                        isFilter: true,
                        type: 'contains',
                    }

                },
            ] 
        } 
    ],
    data:[ 
        
    ]
}
