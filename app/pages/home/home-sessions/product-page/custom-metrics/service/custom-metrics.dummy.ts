import { CustomDataTable } from "./custom-metrics.model";

export interface SessionPageMenuOption {
    label: string;
    routerLink?: any;
    State?: any;
    items?: Array<SessionPageMenuOption>;
}

export const CUSTOM_METRICS_DATA: CustomDataTable = {
    paginator: {
        first: 1,
        rows: 10,
        rowsPerPageOptions: [5, 10, 25, 50, 100],
    },

    headers: [
        {
            cols: [
                {
                    label: 'PageName',
                    valueField: 'pagename',
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
                    label: 'Value',
                    valueField: 'value1',
                    classes: 'text-left',
                    selected: true,
                    filter: {
                        isFilter: true,
                        type: 'contains',
                    },
                    isSort: true,
                },
                
            ]
        }
    ],
    data: [],
    severityBgColorField: 'severityColor',
};