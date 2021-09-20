import { Table } from "src/app/shared/table/table.model";
import { DomainPerformanceCompareTable } from "./domain-performance.model";


export const DOMAIN_PERFORMANCE_COMPARE_TABLE: DomainPerformanceCompareTable = {

    paginator: {
        first: 0,
        rows: 33,
        rowsPerPageOptions: [5, 10, 25, 50, 100],
    },
    calDomainData: [],
    headers: [
        {
            cols: [
                {
                    label: 'd1',
                    valueField: 'duration_count',
                    classes: 'text-center',
                    selected: true,
                    filter: {
                        isFilter: true,
                        type: 'contains',
                    },
                    isSort: true,
                },
                {
                    label: 'd2',
                    valueField: 'duration_count1',
                    classes: 'text-center',
                    selected: true,
                    filter: {
                        isFilter: true,
                        type: 'contains',
                    },
                    isSort: true,
                },
                {
                    label: 'd1',
                    valueField: 'duration_avg',
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
                    valueField: 'duration_avg1',
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
                    valueField: 'response_avg',
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
                    valueField: 'response_avg1',
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
                    valueField: 'wait_avg',
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
                    valueField: 'wait_avg1',
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
                    valueField: 'redirection_avg',
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
                    valueField: 'redirection_avg1',
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
                    valueField: 'dns_avg',
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
                    valueField: 'dns_avg1',
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
                    valueField: 'tcp_avg',
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
                    valueField: 'tcp_avg1',
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
                    valueField: 'ssl_avg',
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
                    valueField: 'ssl_avg1',
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
            title: 'Domain Performance By Request Count',
            highchart: {
                chart: {
                    type: 'column',
                    height: '400px'
                },

                title: {
                    text: null,
                },

                xAxis: {
                    type: 'category',
                    labels: {
                        rotation: -70 || 0,
                        style: {
                            fontSize: '11px',
                            fontFamily: 'Verdana, sans-serif'
                        }
                    }
                },

                yAxis: {
                    min: 0,
                    title: {
                        text: ''
                    }
                },
                credits: {
                    enabled: false
                },
                tooltip: {
                    headerFormat: '<span style="font-size:11px"></span>',
                    pointFormat: '<span style="color:{point.color};text-align: center;">{point.duration}</span><br><span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}</b>'

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
                            format: '{point.y:.2f}',
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
        {
            title: 'Domain Performance Duration',
            highchart: {
                chart: {
                    type: 'column',
                    height: '400px'
                },

                title: {
                    text: null,
                },

                xAxis: {
                    type: 'category',
                    labels: {
                        rotation: -70 || 0,
                        style: {
                            fontSize: '11px',
                            fontFamily: 'Verdana, sans-serif'
                        }
                    }
                },

                yAxis: {
                    min: 0,
                    title: {
                        text: ''
                    }
                },
                credits: {
                    enabled: false
                },
                tooltip: {
                    headerFormat: '<span style="font-size:11px"></span>',
                    pointFormat: '<span style="color:{point.color};text-align: center;">{point.duration}</span><br><span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}</b>'

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
                            format: '{point.y:.2f}',
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
        }
    ],

    tableFilter: true,
};