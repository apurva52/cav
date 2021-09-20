import { CcsVpsTable } from './ccs-vps.model';
export const CcsVps_NAME_DATA: CcsVpsTable = {

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
                    filter: {
                        isFilter: true,
                        type: 'contains',
                    }

                }, 
                {
                    label: 'Server Name',
                    valueField: 'servername',
                    classes: 'text-right',
                    isSort: true,
                    selected: true, 
                    filter: {
                        isFilter: true,
                        type: 'contains',
                    }

                },
                {
                    label: 'Server IP',
                    valueField: 'serverip',
                    classes: 'text-right',
                    isSort: true,
                    selected: true, 
                    filter: {
                        isFilter: true,
                        type: 'contains',
                    }

                }, 
                {
                    label: 'Vender',
                    valueField: 'vender',
                    classes: 'text-right',
                    isSort: true,
                    selected: true,
                    filter: {
                        isFilter: true,
                        type: 'contains',
                    }

                }, 
                {
                    label: 'Status',
                    valueField: 'status',
                    classes: 'text-right',
                    isSort: true,
                    selected: true,
                    filter: {
                        isFilter: true,
                        type: 'contains',
                    }

                },
                {
                    label: 'Uptime',
                    valueField: 'Uptime',
                    classes: 'text-right',
                    isSort: true,
                    selected: true,
                    filter: {
                        isFilter: true,
                        type: 'contains',
                    }

                }, 
                {
                    label: 'Downtime',
                    valueField: 'Downtime',
                    classes: 'text-right',
                    isSort: true,
                    selected: true, 
                    filter: {
                        isFilter: true,
                        type: 'contains',
                    }

                },
                {
                    label: 'Duration',
                    valueField: 'duration',
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
    data: [ 
    ]
}
