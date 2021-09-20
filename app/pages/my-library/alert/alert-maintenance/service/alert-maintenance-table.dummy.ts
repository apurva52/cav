import { Table } from "src/app/shared/table/table.model";
import { MaintenanceTable } from "./alert-maintenance.model";


export const ALERT_MAINTENANCE_TABLE: MaintenanceTable = {

    paginator: {
        first: 1,
        rows: 10,
        rowsPerPageOptions: [10, 25, 50, 100],
    },
   
    headers: [
        {
            cols: [
                {
                    label: 'Schedule Type',
                    valueField: 'type',
                    classes: 'text-left',
                    selected: true,
                    filter: {
                        isFilter: true,
                        type: 'contains',
                      },
                    isSort: true,
                },
                {
                    label: 'Schedule',
                    valueField: 'schedule',
                    classes: 'text-left',
                    selected: true,
                    filter: {
                        isFilter: true,
                        type: 'contains',
                      },
                    isSort: true,
                },
                {
                    label: 'Indices',
                    valueField: 'tagInfo',
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
                    label: 'Upcoming Maintenance Window',
                    valueField: 'maintenanceWindow',
                    classes: 'text-left',
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
    data: [],
};