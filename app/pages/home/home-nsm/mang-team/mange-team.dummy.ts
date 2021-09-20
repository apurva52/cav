import { MteamTable } from './mange-team.model';

export const Mteam_NAME_DATA: MteamTable = {

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
                    filter: {
                        isFilter: true,
                        type: 'contains',
                    },
                    selected: true,
                    width: '5%'
                },
                {
                    label: 'Team',
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
                    label: 'Project',
                    valueField: 'project',
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
                    label: 'Owner',
                    valueField: 'owner',
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
                    label: 'Grnerators Count',
                    valueField: 'generatorCount',
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
    data: [  ]
}