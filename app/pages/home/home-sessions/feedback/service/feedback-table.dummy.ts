import { Table } from "src/app/shared/table/table.model";


export const FEEDBACK_TABLE: Table = {

    paginator: {
        first: 1,
        rows: 15,
        rowsPerPageOptions: [15, 25, 50, 100],
    },
   
    headers: [
        {
            cols: [
                {
                    label: 'Feedback Start Time',
                    field: 'sessionStartTime',
                    classes: 'text-left',
                    selected: true,
                    filter: {
                        isFilter: true,
                        type: 'contains',
                      },
                    isSort: true,
                },
                {
                    label: 'Page Name',
                    field: 'entryPage',
                    classes: 'text-left',
                    selected: true,
                    filter: {
                        isFilter: true,
                        type: 'contains',
                      },
                    isSort: true,
                },
                {
                    label: 'Name',
                    field: 'name',
                    classes: 'text-left',
                    selected: true,
                    filter: {
                        isFilter: true,
                        type: 'contains',
                      },
                    isSort: true,
                },
                {
                    label: 'Contact Number',
                    field: 'contactNumber',
                    classes: 'text-left',
                    selected: true,
                    filter: {
                        isFilter: true,
                        type: 'contains',
                      },
                    isSort: true,
                },
                {
                    label: 'Email ID',
                    field: 'emailID',
                    classes: 'text-left',
                    selected: true,
                    filter: {
                        isFilter: true,
                        type: 'contains',
                      },
                    isSort: true,
                },
                {
                    label: 'Comments',
                    field: 'comments',
                    classes: 'text-left',
                    selected: true,
                    filter: {
                        isFilter: true,
                        type: 'contains',
                      },
                    isSort: true,
                }, 
                {
                    label: 'Rating',
                    field: 'rating',
                    // classes: 'text-left',
                     selected: true,
                     filter: {
                         isFilter: true,
                         type: 'contains',
                     },
                     isSort: true,
                },
            ],
        },
    ],
    data: [
        

    ],
};
