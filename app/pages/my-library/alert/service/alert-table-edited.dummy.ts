import { Table } from "src/app/shared/table/table.model";
import { AlertsTable } from "./alert-table.model";


export const ALERT_TABLE: AlertsTable = {

    paginator: {
        first: 1,
        rows: 33,
        rowsPerPageOptions: [ 5, 10, 25, 50, 100],
    },
   
    headers: [
        {
            cols: [
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
                    tagInfo: true
                },
                {
                    label: 'Rule Name',
                    valueField: 'ruleName',
                    classes: 'text-left',
                    selected: true,
                    filter: {
                        isFilter: true,
                        type: 'contains',
                      },
                    isSort: true,
                },
                {
                    label: 'Alert Status',
                    valueField: 'severity',
                    classes: 'text-center',
                    selected: true,
                    filter: {
                        isFilter: true,
                        type: 'contains',
                      },
                    isSort: true,
                    severity: true,
                    severityColorField: true,
                },
                {
                    label: 'Ack',
                    valueField: 'ack',
                    iconField: true,
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
                    label: 'Start Time',
                    valueField: 'st',
                    classes: 'text-left',
                    selected: true,
                    filter: {
                        isFilter: true,
                        type: 'contains',
                      },
                    isSort: true,
                    st: true,
                },
                {
                    label: 'Time Ago',
                    valueField: 'st',
                    classes: 'text-left',
                    selected: true,
                    filter: {
                        isFilter: true,
                        type: 'contains',
                      },
                    isSort: true,
                    timeAgo: true,
                },
                {
                    label: 'Alert Message',
                    valueField: 'msg',
                    classes: 'text-left',
                    selected: true,
                    filter: {
                        isFilter: true,
                        type: 'contains',
                      },
                    isSort: true,
                },
                {
                    label: 'Alert Value',
                    valueField: 'currentValue',
                    classes: 'text-left',
                    selected: true,
                    filter: {
                        isFilter: true,
                        type: 'contains',
                      },
                    isSort: true,
                },
                {
                    label: 'Threshold',
                    valueField: 'threshold',
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
    iconsField: 'icon',
    severityCondition: 'severity',
    tableFilter: true,
};