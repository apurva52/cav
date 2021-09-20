import { Table } from "src/app/shared/table/table.model";
import { PerformanceTable } from "./resource-performance.model";


export const PERFORMANCE_TABLE: PerformanceTable = {

    paginator: {
        first: 0,
        rows: 33,
        rowsPerPageOptions: [5, 10, 25, 50, 100],
    },
    headers1: [
        {
            cols: [
                {
                    label: 'Content Type',
                    valueField: 'contentType',
                    classes: 'text-left',
                    selected: true,
                    severityColorField: true,
                    filter: {
                        isFilter: true,
                        type: 'contains',
                    },
                    isSort: true,
                },
                {
                    label: 'Count',
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
                    label: 'Count Percentage',
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
                }, {
                    label: 'Duration (ms)',
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
                }
            ]
        }
    ],
    datarequest: [],

    headers: [
        {
            cols: [
                {
                    label: 'Name',
                    valueField: 'resourceName',
                    classes: 'text-left',
                    selected: true,
                    severityColorField: true,
                    filter: {
                        isFilter: true,
                        type: 'contains',
                    },
                    isSort: true,
                },
                {
                    label: 'Domain',
                    valueField: 'domain',
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
                    label: 'Count',
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
                    label: 'Avg Duration(ms)',
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
                    label: 'Avg Wait(ms)',
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
                    label: 'Avg Download(ms)',
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
                    label: 'Avg Redirection(ms)',
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
                    label: 'Avg DNS(ms)',
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
                    label: 'Avg Correction(ms)',
                    valueField: 'connection',
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
                    height: '300px',
                    type: 'pie',
                },

                title: {
                    text: null,
                },
                credits: {
                    enabled: false
                },

                tooltip: {
                    pointFormat: '<b>{point.name}</b>: {point.y:.' + 0 + 'f}' || ' <b>{point.y:.0f}</b>'
                },
                plotOptions: {
                    pie: {
                        allowPointSelect: true,
                        cursor: 'pointer',
                        dataLabels: {
                            enabled: true,
                            //format:  '<b>{point.name}</b>: {point.y:.'+this.decimaplaces+'f}',
                            formatter: function () {
                                let a = '<b>' + this.point.name + '</b>'
                                    + ' : ' + (this.point.y).toLocaleString();
                                return a;
                            },
                            style: {
                                color: 'black'
                            }
                        }
                    }
                },
                legend: {
                    layout: 'vertical',
                    align: 'right',
                    enabled: true,
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