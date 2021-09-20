import { ProjectsTable } from './nsm-projects.model';

export const Project_NAME_DATA: ProjectsTable = {

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
                    label: 'Team',
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
                    label: 'Project',
                    valueField: 'project',
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
                    label: 'Blades Count',
                    valueField: 'bladesCount',
                    classes: 'text-right',
                    isSort: true,
                    selected: true,
                    filter: {
                        isFilter: true,
                        type: 'contains',
                    }

                },
            ], 
        },
       
    ], 
    data:[ 
    ] 
}