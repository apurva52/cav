import { Table } from "src/app/shared/table/table.model";
import { PerformanceCompareTable } from "./performace-details-compare.model";


export const PERFORMANCE_COMPARE_TABLE: PerformanceCompareTable = {
    charts: [
        {
            title: 'Page Performance Trend',
            highchart: {
                chart: {
                    type: 'line',
                    height: '400px',
                },

                title: {
                    text: null
                },


                xAxis: {
                    title: {
                        text: 'Navigation Start Time'
                    },
                    type: 'datetime',
                    labels: { format: '{value:%e %b\'%y %H:%M}' }
                },
                yAxis: [{
                    title: {
                        text: 'Performance Metric'
                    },
                    minorGridLineWidth: 0,
                    gridLineWidth: 0,
                    alternateGridColor: null
                }, {
                    // Primary yAxis
                    labels: {
                        format: '{value}',
                    },
                    title: {
                        text: 'Page Views',
                    },
                    opposite: true

                }],
                plotOptions: {
                    line: {
                        dataLabels: {
                            enabled: false
                        },
                        enableMouseTracking: false
                    },
                    spline: {
                        marker: { enabled: false }
                    },
                    area: {
                        marker: { enabled: false }
                    }
                },
                exporting: {
                    enabled: true,
                    sourceWidth: 1200,
                    sourceHeight: 500,
                },
                tooltip: {
                    shared: true
                },
                credits: {
                    enabled: false
                },
                series: [] as Highcharts.SeriesOptionsType[],
            },
        }
        ,
        {
            title: 'Page Performance Trend',
            highchart: {
                chart: {
                    type: 'line',
                    height: '400px',
                },

                title: {
                    text: null
                },


                xAxis: {
                    title: {
                        text: 'Navigation Start Time'
                    },
                    type: 'datetime',
                    labels: { format: '{value:%e %b\'%y %H:%M}' }
                },
                yAxis: [{
                    title: {
                        text: 'Performance Metric'
                    },
                    minorGridLineWidth: 0,
                    gridLineWidth: 0,
                    alternateGridColor: null
                }, {
                    // Primary yAxis
                    labels: {
                        format: '{value}',
                    },
                    title: {
                        text: 'Page Views',
                    },
                    opposite: true

                }],
                plotOptions: {
                    line: {
                        dataLabels: {
                            enabled: false
                        },
                        enableMouseTracking: false
                    },
                    spline: {
                        marker: { enabled: false }
                    },
                    area: {
                        marker: { enabled: false }
                    }
                },
                exporting: {
                    enabled: true,
                    sourceWidth: 1200,
                    sourceHeight: 500,
                },
                tooltip: {
                    shared: true
                },
                credits: {
                    enabled: false
                },
                series: [] as Highcharts.SeriesOptionsType[],
            },
        }

    ],
    dataLoaded: []
};