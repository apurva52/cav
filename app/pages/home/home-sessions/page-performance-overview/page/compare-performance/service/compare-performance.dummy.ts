import { Table } from "src/app/shared/table/table.model";
import { ComparePerformanceTable } from "./compare-performance.model";


export const COMPARE_TABLE: ComparePerformanceTable = {
    paginator: {
        first: 0,
        rows: 5,
        rowsPerPageOptions: [5, 10, 25, 50, 100],
    },
    headers: [
        {
            cols: [
                {
                    label: '',
                    field: 'hname',
                    classes: 'text-center',
                    isSort: true,
                    tooltip: ''
                },
                {
                    label: 'duration1',
                    field: 'pagecount',
                    classes: 'text-center',
                    isSort: true,
                    tooltip: 'Page Counts duration 1'
                },
                {
                    label: 'duration2',
                    field: 'pagecount1',
                    classes: 'text-center',
                    isSort: true,
                    tooltip: 'Page Counts duration 2'
                },
                {
                    label: 'duration1',
                    field: 'timetoload',
                    iconField: true,
                    classes: 'text-left',

                    isSort: true,
                    //width: '5%'
                    tooltip: 'Onload (Sec) duration 1'
                }, {
                    label: 'duration2',
                    field: 'timetoload1',
                    iconField: true,
                    classes: 'text-left',

                    isSort: true,
                    tooltip: 'Onload (Sec) duration 2'
                    //width: '5%'
                },
                {
                    label: 'duration1',
                    field: 'dominteractivetime',
                    classes: 'text-left',
                    isSort: true,
                    tooltip: 'TTDI (Sec) duration 1'
                }, {
                    label: 'duration2',
                    field: 'dominteractivetime1',
                    classes: 'text-left',
                    isSort: true,
                    tooltip: 'TTDI (Sec) duration 2'
                },
                {
                    label: 'duration1',
                    field: 'domcomplete',
                    classes: 'text-left',

                    isSort: true,
                    tooltip: 'TTDL (Sec) duration 1'
                }, {
                    label: 'duration2',
                    field: 'domcomplete1',
                    classes: 'text-left',

                    isSort: true,
                    tooltip: 'TTDI (Sec) duration 2'
                },
                {
                    label: 'duration1',
                    field: 'servertime',
                    classes: 'text-left',

                    isSort: true,
                    tooltip: 'Server respnse Time (Sec) duration 1'
                }, {
                    label: 'duration2',
                    field: 'servertime1',
                    classes: 'text-left',

                    isSort: true,
                    tooltip: 'Server respnse Time (Sec) duration 2'
                },
                {
                    label: 'duration1',
                    field: 'perceivedrendertime',
                    classes: 'text-left',

                    isSort: true,
                    tooltip: 'PRT (Sec) duration 1'
                }, {
                    label: 'duration2',
                    field: 'perceivedrendertime1',
                    classes: 'text-left',

                    isSort: true,
                    tooltip: 'PRT (Sec) duration 2'
                },
                {
                    label: 'duration1',
                    field: 'dnstime',
                    classes: 'text-left',

                    isSort: true,
                    tooltip: 'DNS (Sec) duration 1'
                }, {
                    label: 'duration2',
                    field: 'dnstime1',
                    classes: 'text-left',

                    isSort: true,
                    tooltip: 'DNS (Sec) duration 2'
                },
                {
                    label: 'duration1',
                    field: 'secure',
                    classes: 'text-left',
                    selected: true,
                    isSort: true,
                    tooltip: 'SSL (Sec) duration 1'
                }, {
                    label: 'duration2',
                    field: 'secure1',
                    classes: 'text-left',
                    selected: true,
                    isSort: true,
                    tooltip: 'SSL (Sec) duration 2'
                },
                {
                    label: 'duration1',
                    field: 'cache',
                    classes: 'text-left',

                    isSort: true,
                    tooltip: 'Cache Lookup Time (Sec) duration 1'
                },
                {
                    label: 'duration2',
                    field: 'cache1',
                    classes: 'text-left',

                    isSort: true,
                    tooltip: 'Cache Lookup Time (Sec) duration 2'
                },
                {
                    label: 'duration1',
                    field: 'network',
                    classes: 'text-left',
                    selected: true,

                    isSort: true,
                    tooltip: 'Network (Sec) duration 1'
                },
                {
                    label: 'duration2',
                    field: 'network1',
                    classes: 'text-left',
                    selected: true,

                    isSort: true,
                    tooltip: 'Network (Sec) duration 2'
                },
                {
                    label: 'duration1',
                    field: 'connectiontime',
                    classes: 'text-left',
                    selected: true,

                    isSort: true,
                    tooltip: 'TCP (Sec) duration 1'
                }, {
                    label: 'duration2',
                    field: 'connectiontime1',
                    classes: 'text-left',
                    selected: true,

                    isSort: true,
                    tooltip: 'TCP (Sec) duration 2'
                },
                {
                    label: 'duration1',
                    field: 'first_content_paint_count',
                    classes: 'text-left',
                    selected: true,

                    isSort: true,
                    tooltip: 'FCP (Sec) duration 1'
                }, {
                    label: 'duration2',
                    field: 'first_content_paint_count1',
                    classes: 'text-left',
                    selected: true,

                    isSort: true,
                    tooltip: 'FCP (Sec) duration 2'
                },
                {
                    label: 'duration1',
                    field: 'firstpaint_count',
                    classes: 'text-left',
                    selected: true,

                    isSort: true,
                    tooltip: 'FP (Sec) duration 1'
                }, {
                    label: 'duration2',
                    field: 'firstpaint_count1',
                    classes: 'text-left',
                    selected: true,

                    isSort: true,
                    tooltip: 'FP (Sec) duration 2'
                },
                {
                    label: 'duration1',
                    field: 'time_to_interactive_count',
                    classes: 'text-left',
                    selected: true,

                    isSort: true,
                    tooltip: 'TTI (Sec) duration 1'
                }, {
                    label: 'duration2',
                    field: 'time_to_interactive_count1',
                    classes: 'text-left',
                    selected: true,

                    isSort: true,
                    tooltip: 'TTI (Sec) duration 2'
                },
                {
                    label: 'duration1',
                    field: 'first_input_delay_count',
                    classes: 'text-left',
                    selected: true,

                    isSort: true,
                    tooltip: 'FID (Sec) duration 1'
                }, {
                    label: 'duration2',
                    field: 'first_input_delay_count1',
                    classes: 'text-left',
                    selected: true,

                    isSort: true,
                    tooltip: 'FID (Sec) duration 2'
                },
                {
                    label: 'duration1',
                    field: 'exitlt',
                    classes: 'text-left',
                    selected: true,

                    isSort: true,
                    tooltip: 'Exit PCT (Sec) duration 1'
                }, {
                    label: 'duration2',
                    field: 'exitlt1',
                    classes: 'text-left',
                    selected: true,

                    isSort: true,
                    tooltip: 'Exit PCT (Sec) duration 2'
                }
            ],
        },
    ],
    data: [],
    charts: [
        {
            title: 'Page Performance Report ',
            highchart: {
                chart: {
                    type: 'bar',
                    height: '480px'
                },

                title: {
                    text: null,
                },
                colors: ['#7cb5ec', '#a6cdf2', '#434348', '#62626a', '#90ed7d', '#b2f3a5', '#f7a35c', '#f9ba86', '#8085e9', '#a8acf0', '#f15c80', '#f58aa3', '#e4d354', '#eadd7b', '#2b908f', '#3bc4c2', '#f45b5b', '#f78888', '#91e8e1', '#abede8', '#7300e6', '#9933ff', '#cc0052', '#ff3385', '#ff66a3', '#ffabcd', '#b1ff63', '#ccffa9', '#d24dff', '#ecb3ff', '#bf4040', '#d98c8c'],
                xAxis: {
                    categories: [],
                    title: {
                        text: "page(s)"
                    }
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: 'Value(sec)'
                    }
                },
                tooltip: {
                    headerFormat: '<span style="font-size:11px"></span>',
                    pointFormat: '<span style="color:{point.color}">{series.duration}</span><br><span style="color:{point.color}">{series.name}</span>: <b>{point.y:.2f}</b>'
                },
                exporting: {
                    enabled: true,
                    sourceWidth: 1300,
                    sourceHeight: 3000,
                },
                plotOptions: {
                    bar: {
                        dataLabels: {
                            enabled: true,
                            allowOverlap: true
                        }
                    }
                },
                credits: {
                    enabled: false
                },
                legend: {
                    layout: 'vertical',
                    align: 'right',
                    verticalAlign: 'top',
                    x: -40,
                    y: 80,
                    floating: false,
                    borderWidth: 1,
                    shadow: true
                },
                series: [] as Highcharts.SeriesOptionsType[],
            },
        },
    ],
};
