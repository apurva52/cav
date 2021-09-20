import { Table } from "src/app/shared/table/table.model";
import { PerformanceTable } from "./resource-performance.model";


export const PERFORMANCE_COMPARE_TABLE: PerformanceTable = {

    paginator: {
        first: 0,
        rows: 33,
        rowsPerPageOptions: [5, 10, 25, 50, 100],
    },
    headers1: [
        {
            cols: [
                {
                    label: 'd1',
                    valueField: 'count',
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
                    label: 'd2',
                    valueField: 'count1',
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
                    label: 'd1',
                    valueField: 'countpct',
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
                    label: 'd2',
                    valueField: 'countpct1',
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
                    label: 'd1',
                    valueField: 'avgDuration',
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
                    label: 'd2',
                    valueField: 'avgDuration1',
                    classes: 'text-center',
                    selected: true,
                    filter: {
                        isFilter: true,
                        type: 'contains',
                    },
                    isSort: true,
                    severity: true,
                    severityColorField: true,
                }
            ]
        }
    ],
    datarequest: [],

    headers: [
        {
            cols: [
                {
                    label: 'd1',
                    valueField: 'count',
                    iconField: true,
                    classes: 'text-left',
                    selected: true,
                    filter: {
                        isFilter: true,
                        type: 'contains',
                    },
                    isSort: true,
                },
                {
                    label: 'd2',
                    valueField: 'count1',
                    iconField: true,
                    classes: 'text-left',
                    selected: true,
                    filter: {
                        isFilter: true,
                        type: 'contains',
                    },
                    isSort: true,
                },
                {
                    label: 'd1',
                    valueField: 'duration',
                    classes: 'text-left',
                    selected: true,
                    filter: {
                        isFilter: true,
                        type: 'contains',
                    },
                    isSort: true,
                },
                {
                    label: 'd2',
                    valueField: 'duration1',
                    classes: 'text-left',
                    selected: true,
                    filter: {
                        isFilter: true,
                        type: 'contains',
                    },
                    isSort: true,
                },
                {
                    label: 'd1',
                    valueField: 'wait',
                    classes: 'text-left',
                    selected: true,
                    filter: {
                        isFilter: true,
                        type: 'contains',
                    },
                    isSort: true,
                },
                {
                    label: 'd2',
                    valueField: 'wait1',
                    classes: 'text-left',
                    selected: true,
                    filter: {
                        isFilter: true,
                        type: 'contains',
                    },
                    isSort: true,
                },
                {
                    label: 'd1',
                    valueField: 'download',
                    classes: 'text-left',
                    selected: true,
                    filter: {
                        isFilter: true,
                        type: 'contains',
                    },
                    isSort: true,
                },
                {
                    label: 'd2',
                    valueField: 'download1',
                    classes: 'text-left',
                    selected: true,
                    filter: {
                        isFilter: true,
                        type: 'contains',
                    },
                    isSort: true,
                },
                {
                    label: 'd1',
                    valueField: 'redirection',
                    classes: 'text-left',
                    selected: true,
                    filter: {
                        isFilter: true,
                        type: 'contains',
                    },
                    isSort: true,
                },
                {
                    label: 'd2',
                    valueField: 'redirection1',
                    classes: 'text-left',
                    selected: true,
                    filter: {
                        isFilter: true,
                        type: 'contains',
                    },
                    isSort: true,
                },
                {
                    label: 'd1',
                    valueField: 'dns',
                    classes: 'text-left',
                    selected: true,
                    filter: {
                        isFilter: true,
                        type: 'contains',
                    },
                    isSort: true,
                },
                {
                    label: 'd2',
                    valueField: 'dns1',
                    classes: 'text-left',
                    selected: true,
                    filter: {
                        isFilter: true,
                        type: 'contains',
                    },
                    isSort: true,
                },
                {
                    label: 'd1',
                    valueField: 'connection',
                    classes: 'text-left',
                    selected: true,
                    filter: {
                        isFilter: true,
                        type: 'contains',
                    },
                    isSort: true,
                },
                {
                    label: 'd2',
                    valueField: 'connection1',
                    classes: 'text-left',
                    selected: true,
                    filter: {
                        isFilter: true,
                        type: 'contains',
                    },
                    isSort: true,
                }
            ],
        },
    ],
    data: [],

    charts: [
        {
            title: 'Content Type By Request Count',
            highchart: {
                chart: {
                    height: '400px',
                    type: 'column',
                },

                title: {
                    text: null,
                },
                credits: {
                    enabled: false
                },

                tooltip: {
                    headerFormat: '<span style="font-size:11px"></span>',
                    pointFormat: '<span style="color:{point.color};text-align: center;">{point.duration}</span><br><span style="color:{point.color}">{point.name}</span>: <b>{point.y:.0f}</b>'

                },
                plotOptions: {
                    series: {
                        borderWidth: 0,
                        dataLabels: {
                            enabled: true,
                            align: 'left',
                            crop: false,
                            rotation: 270,
                            x: 2,
                            y: -10,
                            allowOverlap: true,
                            format: '{point.y:.0f}',
                            style: {
                                fontSize: "8px"
                            }
                        }
                    }
                },
                legend: {
                    layout: 'vertical',
                    align: 'right',
                    enabled: false,
                    verticalAlign: 'middle',
                    x: 0,
                    y: 0,
                },
                series: [] as Highcharts.SeriesOptionsType[],
            },
        },
    ],

    severityCondition: 'severity',
    tableFilter: true,
};