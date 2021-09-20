import { Table } from "src/app/shared/table/table.model";


export const CATALOUGE_MANAGEMENT_TABLE: Table = {

    paginator: {
        first: 1,
        rows: 10,
        rowsPerPageOptions: [10, 25, 50, 100],
    },
   
    headers: [
        {
            cols: [
                {
                    label: '#',
                    valueField: 'serial',
                    classes: 'text-left',
                    selected: true,
                    filter: {
                        isFilter: true,
                        type: 'contains',
                      },
                    isSort: true,
                },
                {
                    label: 'Catalogue Name',
                    valueField: 'name',
                    classes: 'text-left',
                    selected: true,
                    filter: {
                        isFilter: true,
                        type: 'contains',
                      },
                    isSort: true,
                },
                {
                    label: 'Graph Type',
                    valueField: 'metricType',
                    classes: 'text-left',
                    selected: true,
                    filter: {
                        isFilter: true,
                        type: 'contains',
                      },
                    isSort: true,
                },
                {
                    label: 'Description',
                    valueField: 'description',
                    classes: 'text-left',
                    selected: true,
                    filter: {
                        isFilter: true,
                        type: 'contains',
                      },
                    isSort: true,
                },
                {
                    label: 'Created By',
                    valueField: 'createdBy',
                    classes: 'text-left',
                    selected: true,
                    filter: {
                        isFilter: true,
                        type: 'contains',
                      },
                    isSort: true,
                },
                {
                    label: 'Creation Date',
                    valueField: 'creationDate',
                    classes: 'text-right',
                    selected: true,
                    filter: {
                        isFilter: true,
                        type: 'contains',
                      },
                    isSort: true,
                },
                {
                    label: 'Action',
                    valueField: 'action',
                    classes: 'text-center',
                    isSort: false,
                    selected:true,
                    filter: {
                      isFilter: true,
                      type: 'contains',
                    },
                    iconField: true,
                    
                  },

            ],
        },
    ],
    data: [
        {
            srno: '1',
            catalogueName: 'Cav-CatalougeName',
            graphType: 'Bar Graph',
            description: 'Dummy Text',
            createdBy: 'John Doe',
            createdOn: '20/05/2020 16:45'
        },
        {
            srno: '2',
            catalogueName: 'Cav-CatalougeName',
            graphType: 'Bar Graph',
            description: 'Dummy Text',
            createdBy: 'John Doe',
            createdOn: '20/05/2020 16:45'
        },
        {
            srno: '3',
            catalogueName: 'Cav-CatalougeName',
            graphType: 'Bar Graph',
            description: 'Dummy Text',
            createdBy: 'John Doe',
            createdOn: '20/05/2020 16:45'
        },
        {
            srno: '4',
            catalogueName: 'Cav-CatalougeName',
            graphType: 'Bar Graph',
            description: 'Dummy Text',
            createdBy: 'John Doe',
            createdOn: '20/05/2020 16:45'
        },
        {
            srno: '5',
            catalogueName: 'Cav-CatalougeName',
            graphType: 'Bar Graph',
            description: 'Dummy Text',
            createdBy: 'John Doe',
            createdOn: '20/05/2020 16:45'
        },
        {
            srno: '6',
            catalogueName: 'Cav-CatalougeName',
            graphType: 'Bar Graph',
            description: 'Dummy Text',
            createdBy: 'John Doe',
            createdOn: '20/05/2020 16:45'
        },
        {
            srno: '7',
            catalogueName: 'Cav-CatalougeName',
            graphType: 'Bar Graph',
            description: 'Dummy Text',
            createdBy: 'John Doe',
            createdOn: '20/05/2020 16:45'
        },
        {
            srno: '8',
            catalogueName: 'Cav-CatalougeName',
            graphType: 'Bar Graph',
            description: 'Dummy Text',
            createdBy: 'John Doe',
            createdOn: '20/05/2020 16:45'
        },
        {
            srno: '9',
            catalogueName: 'Cav-CatalougeName',
            graphType: 'Bar Graph',
            description: 'Dummy Text',
            createdBy: 'John Doe',
            createdOn: '20/05/2020 16:45'
        },
        {
            srno: '10',
            catalogueName: 'Cav-CatalougeName',
            graphType: 'Bar Graph',
            description: 'Dummy Text',
            createdBy: 'John Doe',
            createdOn: '20/05/2020 16:45'
        },
        {
            srno: '11',
            catalogueName: 'Cav-CatalougeName',
            graphType: 'Bar Graph',
            description: 'Dummy Text',
            createdBy: 'John Doe',
            createdOn: '20/05/2020 16:45'
        },
        {
            srno: '12',
            catalogueName: 'Cav-CatalougeName',
            graphType: 'Bar Graph',
            description: 'Dummy Text',
            createdBy: 'John Doe',
            createdOn: '20/05/2020 16:45'
        },
        {
            srno: '13',
            catalogueName: 'Cav-CatalougeName',
            graphType: 'Bar Graph',
            description: 'Dummy Text',
            createdBy: 'John Doe',
            createdOn: '20/05/2020 16:45'
        },
        {
            srno: '14',
            catalogueName: 'Cav-CatalougeName',
            graphType: 'Bar Graph',
            description: 'Dummy Text',
            createdBy: 'John Doe',
            createdOn: '20/05/2020 16:45'
        },
        {
            srno: '15',
            catalogueName: 'Cav-CatalougeName',
            graphType: 'Bar Graph',
            description: 'Dummy Text',
            createdBy: 'John Doe',
            createdOn: '20/05/2020 16:45'
        },
        {
            srno: '16',
            catalogueName: 'Cav-CatalougeName',
            graphType: 'Bar Graph',
            description: 'Dummy Text',
            createdBy: 'John Doe',
            createdOn: '20/05/2020 16:45'
        },
        {
            srno: '17',
            catalogueName: 'Cav-CatalougeName',
            graphType: 'Bar Graph',
            description: 'Dummy Text',
            createdBy: 'John Doe',
            createdOn: '20/05/2020 16:45'
        },
        {
            srno: '18',
            catalogueName: 'Cav-CatalougeName',
            graphType: 'Bar Graph',
            description: 'Dummy Text',
            createdBy: 'John Doe',
            createdOn: '20/05/2020 16:45'
        },

    ],
};