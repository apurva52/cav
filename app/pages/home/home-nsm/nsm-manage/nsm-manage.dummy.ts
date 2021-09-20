import { manageTable } from './nsm-manage.model';

export const Manage_NAME_DATA: manageTable = {

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
                    label: 'Name',
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
                    label: 'IP',
                    valueField: 'ip',
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
                    label: 'Blade',
                    valueField: 'blade',
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
                    label: 'Build',
                    valueField: 'build',
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
                    label: 'Team',
                    valueField: 'team',
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
                    label: 'Channel',
                    valueField: 'channel',
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
                    label: 'Allocation',
                    valueField: 'allocation',
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
                    label: 'Machine Type',
                    valueField: 'machine',
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
                    label: 'Refresh At',
                    valueField: 'refreshAt',
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