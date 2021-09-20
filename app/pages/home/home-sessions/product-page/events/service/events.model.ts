import { EventsDataTable } from "./events-data.model";

export interface SessionPageMenuOption {
    label: string;
    routerLink?: any;
    State?: any;
    items?: Array<SessionPageMenuOption>;
}

export const EVENTS_DATA: EventsDataTable = {
    paginator: {
        first: 1,
        rows: 10,
        rowsPerPageOptions: [5, 10, 25, 50, 100],
    },

    headers: [
        {
            cols: [
                {
                    label: 'Event Name',
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
                    label: 'Event Description',
                    valueField: 'description',
                    classes: 'text-left',
                    selected: true,
                    filter: {
                        isFilter: true,
                        type: 'contains',
                    },
                    isSort: true,
                }
            ]
        }


    ],
    data: [],
    severityBgColorField: 'severityColor',
};
