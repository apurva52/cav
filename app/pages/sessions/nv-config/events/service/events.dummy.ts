import { EventsTable } from "./events.model";

export const EVENTS_DATA: EventsTable = {

    paginator: {
        first: 1,
        rows: 10,
        rowsPerPageOptions: [10, 20, 50, 100],
    },


    headers: [
        {
            cols: [
                {
                    label: 'Icons',
                    valueField: 'icons',
                    classes: 'text-left',
                    iconField: true,
                    isSort: false,
                    filter: {
                        isFilter: false,
                        type: 'contains',
                    },
                    selected: true,
                    width: '10%'
                },
                {
                    label: 'Struggling',
                    valueField: 'strugglingEvent',
                    classes: 'text-left',
                    iconField: true,
                    isSort: false,
                    filter: {
                        isFilter: false,
                        type: 'contains',
                    },
                    selected: true,
                    width: '10%'
                },
                {
                    label: 'Name',
                    valueField: 'name',
                    classes: 'text-left',
                    isSort: true,

                    filter: {
                        isFilter: true,
                        type: 'contains',
                    },
                    selected: true
                },
                {
                    label: 'Description',
                    valueField: 'eventDescription',
                    classes: 'text-left',
                    isSort: true,

                    filter: {
                        isFilter: true,
                        type: 'contains',
                    },
                    selected: true
                },
                {
                    label: 'Goal',
                    valueField: 'goal',
                    classes: 'text-left',
                    isSort: true,

                    filter: {
                        isFilter: true,
                        type: 'contains',
                    },
                    selected: true,
                    width: '10%'
                }
            ],
        },
    ],
    data: [

    ],
    iconsField: 'icon',
    iconsFieldEvent: 'iconStruggling',
    tableFilter: true,
};
