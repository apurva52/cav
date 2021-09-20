import { BladesTable } from './nsm-blades.model';
export const Blades_NAME_DATA: BladesTable = {

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
                    label: 'Name',
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
                    label: 'IP',
                    valueField: 'ip',
                    classes: 'text-right',
                    isSort: true,
                    selected: true,
                    filter: {
                        isFilter: true,
                        type: 'contains',
                    }

                },
                {
                    label: 'Blade',
                    valueField: 'blade',
                    classes: 'text-right',
                    isSort: true,
                    selected: true, 
                    filter: {
                        isFilter: true,
                        type: 'contains',
                    }

                },
                {
                    label: 'Uversion',
                    valueField: 'uversion',
                    classes: 'text-right',
                    isSort: true,
                    selected: true, 
                    filter: {
                        isFilter: true,
                        type: 'contains',
                    }

                },
                {
                    label: 'Machine',
                    valueField: 'machine',
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
                    label: 'Team',
                    valueField: 'team',
                    classes: 'text-right',
                    isSort: true,
                    selected: true,
                    filter: {
                        isFilter: true,
                        type: 'contains',
                    }

                },
                {
                    label: 'Channel',
                    valueField: 'channel',
                    classes: 'text-right',
                    isSort: true,
                    selected: true,
                    filter: {
                        isFilter: true,
                        type: 'contains',
                    }

                },
                 {
                    label: 'Owner',
                    valueField: 'owner',
                    classes: 'text-right',
                    isSort: true,
                    selected: true,
                     filter: {
                         isFilter: true,
                         type: 'contains',
                     }
                    
                },
                {
                    label: 'Allocation',
                    valueField: 'allocation',
                    classes: 'text-right',
                    isSort: true,
                    selected: true,
                    filter: {
                        isFilter: true,
                        type: 'contains',
                    }

                },
                {
                    label: 'Build',
                    valueField: 'build',
                    classes: 'text-right',
                    isSort: true,
                    selected: true,
                    filter: {
                        isFilter: true,
                        type: 'contains',
                    }

                },
                {
                    label: 'Upgrade date',
                    valueField: 'upgradeDate',
                    classes: 'text-right',
                    isSort: true,
                    selected: true,
                    filter: {
                        isFilter: true,
                        type: 'contains',
                    }

                },
                {
                    label: 'Refresh At',
                    valueField: 'refreshAt',
                    classes: 'text-right',
                    isSort: true,
                    selected: true,
                    filter: {
                        isFilter: true,
                        type: 'contains',
                    }

                },
                {
                    label: 'Bandwidth',
                    valueField: 'bandwidth',
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
    ] ,
    data:[ 
       
    ]
}
