import { Table } from "src/app/shared/table/table.model";
import { DomainPerformanceTable } from "./domain-performance.model";


export const DOMAIN_PERFORMANCE_TABLE: DomainPerformanceTable = {

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
                    label: 'Domain Name',
                    valueField: 'domain',
                    classes: 'text-left',
                    selected: true,
                    filter: {
                        isFilter: true,
                        type: 'contains',
                    },
                    isSort: true,
                },
                {
                    label: 'Total Request',
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
                    label: 'Avg Duration(ms)',
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
                    label: 'Avg Download Time(ms)',
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
                    label: 'Avg Wait Time (ms)',
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
                    label: 'Avg Redirection Time(ms)',
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
                    label: 'Avg DNS(ms)',
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
                    label: 'Avg TCP(ms)',
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
                    label: 'Avg SSL(ms)',
                    valueField: 'ssl_avg',
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
                    type: 'pie',
                    height: '350px'
                },

                title: {
                    text: null,
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
                    pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}</b>'
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