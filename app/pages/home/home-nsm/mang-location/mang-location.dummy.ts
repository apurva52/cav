import { MlocationTable } from './mange-location.model';

export const Mlocation_NAME_DATA: MlocationTable = {

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
                    label: 'Location/City',
                    valueField: 'city',
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
                    label: 'State',
                    valueField: 'state',
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
                    label: 'Country',
                    valueField: 'country',
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
                    label: 'Latitude',
                    valueField: 'lattitude',
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
                    label: 'Longitude',
                    valueField: 'longitude',
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
                    label: 'Country Code',
                    valueField: 'code',
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
                    label: 'Zone',
                    valueField: 'zone',
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
                    label: 'Servers Count',
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
    data: [ 
       
    ]
}