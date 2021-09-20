import { BusinessProcessTable } from "./business-process.model";


export const BUSINESS_PROCESS_TABLE: BusinessProcessTable = {

    paginator: {
        first: 1,
        rows: 33,
        rowsPerPageOptions: [ 5, 10, 25, 50, 100],
    },
   
    headers: [
        {
            cols: [
                {
                    label: 'Name',
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
                    label: 'Description',
                    valueField: 'desc',
                    classes: 'text-center',
                    selected: true,
                    filter: {
                        isFilter: true,
                        type: 'contains',
                      },
                    isSort: true,
                },
                {
                    label: 'Channel',
                    valueField: 'channel',
                    
                    classes: 'text-left',
                    selected: true,
                    filter: {
                        isFilter: true,
                        type: 'contains',
                      },
                    isSort: true,
                    //width: '5%'
                },
                {
                    label: 'User Segment',
                    valueField: 'segment',
                    classes: 'text-left',
                    selected: true,
                    filter: {
                        isFilter: true,
                        type: 'contains',
                      },
                    isSort: true,
                },
                {
                    label: 'Last Modified',
                    valueField: 'modified',
                    classes: 'text-left',
                    selected: true,
                    filter: {
                        isFilter: true,
                        type: 'contains',
                      },
                    isSort: true,
                },
                {
                    label: 'Checkout',
                    valueField: 'checkout',
                    classes: 'text-left',
                    selected: true,
                    iconField: true,
                    filter: {
                        isFilter: true,
                        type: 'contains',
                      },
                    isSort: true,
                    width: '5%',
                },
               
            ],
        },
    ],
    data: [
        {
            name: 'Business Process 1',
            desc: 'Business Process Description',
            channel: 'All',
            segment: 'All',
            modified: '23:51:24, 02/02/20',
            checkout: 'Yes',
            icon: 'icons8 icons8-edit-2'
        },
        {
            name: 'Business Process 1',
            desc: 'Business Process Description',
            channel: 'All',
            segment: 'All',
            modified: '23:51:24, 02/02/20',
            checkout: 'Yes',
            icon: 'icons8 icons8-edit-2'
        },
        {
            name: 'Business Process 1',
            desc: 'Business Process Description',
            channel: 'All',
            segment: 'All',
            modified: '23:51:24, 02/02/20',
            checkout: 'Yes',
            icon: 'icons8 icons8-edit-2'
        },
        {
            name: 'Business Process 1',
            desc: 'Business Process Description',
            channel: 'All',
            segment: 'All',
            modified: '23:51:24, 02/02/20',
            checkout: 'Yes',
        },
        {
            name: 'Business Process 1',
            desc: 'Business Process Description',
            channel: 'All',
            segment: 'All',
            modified: '23:51:24, 02/02/20',
            checkout: 'Yes',
        },
        {
            name: 'Business Process 1',
            desc: 'Business Process Description',
            channel: 'All',
            segment: 'All',
            modified: '23:51:24, 02/02/20',
            checkout: 'Yes',
        },
        {
            name: 'Business Process 1',
            desc: 'Business Process Description',
            channel: 'All',
            segment: 'All',
            modified: '23:51:24, 02/02/20',
            checkout: 'Yes',
        },
        {
            name: 'Business Process 1',
            desc: 'Business Process Description',
            channel: 'All',
            segment: 'All',
            modified: '23:51:24, 02/02/20',
            checkout: 'Yes',
        },
        {
            name: 'Business Process 1',
            desc: 'Business Process Description',
            channel: 'All',
            segment: 'All',
            modified: '23:51:24, 02/02/20',
            checkout: 'Yes',
        },
        {
            name: 'Business Process 1',
            desc: 'Business Process Description',
            channel: 'All',
            segment: 'All',
            modified: '23:51:24, 02/02/20',
            checkout: 'Yes',
        },
        {
            name: 'Business Process 1',
            desc: 'Business Process Description',
            channel: 'All',
            segment: 'All',
            modified: '23:51:24, 02/02/20',
            checkout: 'Yes',
        },
        {
            name: 'Business Process 1',
            desc: 'Business Process Description',
            channel: 'All',
            segment: 'All',
            modified: '23:51:24, 02/02/20',
            checkout: 'Yes',
        },
        {
            name: 'Business Process 1',
            desc: 'Business Process Description',
            channel: 'All',
            segment: 'All',
            modified: '23:51:24, 02/02/20',
            checkout: 'Yes',
        },
        {
            name: 'Business Process 1',
            desc: 'Business Process Description',
            channel: 'All',
            segment: 'All',
            modified: '23:51:24, 02/02/20',
            checkout: 'Yes',
        },
        {
            name: 'Business Process 1',
            desc: 'Business Process Description',
            channel: 'All',
            segment: 'All',
            modified: '23:51:24, 02/02/20',
            checkout: 'Yes',
        },
    ],
    iconsField: 'icon',
    tableFilter: true,
};