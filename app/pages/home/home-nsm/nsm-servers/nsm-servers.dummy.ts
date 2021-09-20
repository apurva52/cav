import { ServersTable } from './nsm-servers.model';

export const Servers_NAME_DATA: ServersTable = {

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
                    width:"15%",
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
                    selected: false,
                    width: "15%",
                    filter: {
                        isFilter: true,
                        type: 'contains',
                    }

                },
                {
                    label: 'Vander',
                    valueField: 'vandor',
                    classes: 'text-right',
                    isSort: true,
                    selected: true, 
                    width:"15%",
                    filter: {
                        isFilter: true,
                        type: 'contains',
                    }

                },
                {
                    label: 'Location',
                    valueField: 'location',
                    classes: 'text-right',
                    isSort: true,
                    selected: true, 
                    width: "10%",
                    filter: {
                        isFilter: true,
                        type: 'contains',
                    }

                },
                 {
                    label: 'state',
                    valueField: 'state',
                    classes: 'text-right',
                    isSort: true,
                    selected: false, 
                     width: "10%",
                     filter: {
                         isFilter: true,
                         type: 'contains',
                     }

                },
                 {
                    label: 'Country',
                     valueField: 'country',
                    classes: 'text-right',
                    isSort: true,
                    selected: true, 
                     width: '10%',
                     filter: {
                         isFilter: true,
                         type: 'contains',
                     }

                },
                 {
                    label: 'Zone',
                    valueField: 'zone',
                    classes: 'text-right',
                    isSort: true,
                    selected: true,
                     width: '10%',
                     filter: {
                         isFilter: true,
                         type: 'contains',
                     }

                },
                {
                    label: 'CPU',
                    valueField: 'cpu',
                    classes: 'text-right',
                    isSort: true,
                    selected: true,
                    width: '10%',
                    filter: {
                        isFilter: true,
                        type: 'contains',
                    }

                },
                {
                    label: 'Ram',
                    valueField: 'ramInGB',
                    classes: 'text-right',
                    isSort: true,
                    selected: false, 
                    width: '5%',
                    filter: {
                        isFilter: true,
                        type: 'contains',
                    }

                },
                {
                    label: 'Total Disk(GB)',
                    valueField: 'totalDiskSpace',
                    classes: 'text-right',
                    isSort: true,
                    selected: true, 
                    width: '10%',
                    filter: {
                        isFilter: true,
                        type: 'contains',
                    }

                },
                {
                    label: 'Avail Disk Root(GB)',
                    valueField: 'availableDiskSpaceRoot',
                    classes: 'text-right',
                    isSort: true,
                    selected: true, 
                    width: '15%',
                    filter: {
                        isFilter: true,
                        type: 'contains',
                    }

                },
                {
                    label: 'Avail Disk Home(GB)',
                    valueField: 'availableDiskSpaceHome',
                    classes: 'text-right',
                    isSort: true,
                    selected: false, 
                    width: '15%',
                    filter: {
                        isFilter: true,
                        type: 'contains',
                    }

                },
                {
                    label: 'Kernal',
                    valueField: 'kernal',
                    classes: 'text-right',
                    isSort: true,
                    selected: false,
                    width: '15%',
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
                    width: '20%',
                    filter: {
                        isFilter: true,
                        type: 'contains',
                    }
                },
                {
                    label: 'Security Group',
                    valueField: 'securityGroup',
                    classes: 'text-right',
                    isSort: true,
                    selected: true, 
                    width: '10%',
                    filter: {
                        isFilter: true,
                        type: 'contains',
                    }

                },
                {
                    label: 'Open Ports',
                    valueField: 'openPorts',
                    classes: 'text-right',
                    isSort: true,
                    selected: true, 
                    width: '10%',
                    filter: {
                        isFilter: true,
                        type: 'contains',
                    }

                },
                {
                    label: 'Model',
                    valueField: 'model',
                    classes: 'text-right',
                    isSort: true,
                    selected: false, 
                    width: '10%',
                    filter: {
                        isFilter: true,
                        type: 'contains',
                    }

                },
                {
                    label: 'Frequency',
                    valueField: 'frequency',
                    classes: 'text-right',
                    isSort: true,
                    selected: false, 
                    width: '10%',
                    filter: {
                        isFilter: true,
                        type: 'contains',
                    }

                },
                {
                    label: 'Rating',
                    valueField: 'rating',
                    classes: 'text-right',
                    isSort: true,
                    selected: false,
                    width: '10%',
                    filter: {
                        isFilter: true,
                        type: 'contains',
                    }

                }
            ]

        }
    ],
    data: [
        
    ]
}
