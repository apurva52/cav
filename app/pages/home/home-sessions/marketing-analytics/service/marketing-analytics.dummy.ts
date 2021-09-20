import { VisualChart } from "./marketing-analytics.model";
//import { Table } from "src/app/shared/table/table.model";
import { MarketAnalyticsTable } from './table.model';

export const MARKETING_ANALYTICS_TABLE: MarketAnalyticsTable = {

    paginator: {
        first: 1,
        rows: 10,
        rowsPerPageOptions: [10, 25, 50, 100],
    },
    customTime: null,
    filtercriteria: null,
    campaigns: null,
    headers: [
        {
            cols: [
                {
                    label: 'Campaign',
                    field: 'utm_campaign',
                    classes: 'text-left',
                    selected: true,
                    filter: {
                        isFilter: true,
                        type: 'contains',
                    },
                    isSort: true,
                },
                {
                    label: 'Total Session',
                    field: 'total_session',
                    classes: 'text-right',
                    selected: true,
                    filter: {
                        isFilter: true,
                        type: 'contains',
                    },
                    isSort: true,
                },
                {
                    label: 'Page Count',
                    field: 'pagecount',
                    classes: 'text-right',
                    selected: true,
                    filter: {
                        isFilter: true,
                        type: 'contains',
                    },
                    isSort: true,
                },
                {
                    label: 'Avg. Session Duration(Sec)',
                    field: 'avg_session_duration',
                    classes: 'text-right',
                    selected: true,
                    filter: {
                        isFilter: true,
                        type: 'contains',
                    },
                    isSort: true,
                },
                {
                    label: 'Order Total',
                    field: 'ordertotal',
                    classes: 'text-right',
                    selected: true,
                    filter: {
                        isFilter: true,
                        type: 'contains',
                    },
                    isSort: true,
                },
                {
                    label: 'Order Count',
                    field: 'order_count',
                    classes: 'text-right',
                    selected: true,
                    filter: {
                        isFilter: true,
                        type: 'contains',
                    },
                    isSort: true,
                },
                {
                    label: 'Conversion Rate(%)',
                    field: 'conv_rate',
                    classes: 'text-right',
                    selected: true,
                    filter: {
                        isFilter: true,
                        type: 'contains',
                    },
                    isSort: true,
                },
                {
                    label: 'Bounce Rate(%)',
                    field: 'bounce_rate',
                    classes: 'text-right',
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
    data: []
};

export const MA_MEDIUM_TABLE: MarketAnalyticsTable = {

    paginator: {
        first: 1,
        rows: 10,
        rowsPerPageOptions: [10, 25, 50, 100],
    },
    customTime: null,
    filtercriteria: null,
    campaigns: null,
    headers: [
        {
            cols: [
                {
                    label: 'Medium',
                    field: 'medium',
                    classes: 'text-left',
                    selected: true,
                    filter: {
                        isFilter: true,
                        type: 'contains',
                    },
                    isSort: true,
                },
                {
                    label: 'Total Session',
                    field: 'totalsession',
                    classes: 'text-right',
                    selected: true,
                    filter: {
                        isFilter: true,
                        type: 'contains',
                    },
                    isSort: true,
                },
                {
                    label: 'Page Count',
                    field: 'pagecount',
                    classes: 'text-right',
                    selected: true,
                    filter: {
                        isFilter: true,
                        type: 'contains',
                    },
                    isSort: true,
                },
                {
                    label: 'Avg. Session Duration(Sec)',
                    field: 'sessiondur',
                    classes: 'text-right',
                    selected: true,
                    filter: {
                        isFilter: true,
                        type: 'contains',
                    },
                    isSort: true,
                },
                {
                    label: 'Avg. Page Per Session',
                    field: 'avg_nop_in_session',
                    classes: 'text-right',
                    selected: true,
                    filter: {
                        isFilter: true,
                        type: 'contains',
                    },
                    isSort: true,
                },
                {
                    label: 'Order Total',
                    field: 'ordertotal',
                    classes: 'text-right',
                    selected: true,
                    filter: {
                        isFilter: true,
                        type: 'contains',
                    },
                    isSort: true,
                },
                {
                    label: 'Order Count',
                    field: 'ordercount',
                    classes: 'text-right',
                    selected: true,
                    filter: {
                        isFilter: true,
                        type: 'contains',
                    },
                    isSort: true,
                },
                {
                    label: 'Conversion Rate(%)',
                    field: 'conversionrate',
                    classes: 'text-right',
                    selected: true,
                    filter: {
                        isFilter: true,
                        type: 'contains',
                    },
                    isSort: true,
                },
                {
                    label: 'Bounce Rate(%)',
                    field: 'bouncerate',
                    classes: 'text-right',
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
    data: []
};

export const MA_SOURCE_TABLE: MarketAnalyticsTable = {

    paginator: {
        first: 1,
        rows: 10,
        rowsPerPageOptions: [10, 25, 50, 100],
    },
    customTime: null,
    filtercriteria: null,
    campaigns: null,
    headers: [
        {
            cols: [
                {
                    label: 'Source',
                    field: 'source',
                    classes: 'text-left',
                    selected: true,
                    filter: {
                        isFilter: true,
                        type: 'contains',
                    },
                    isSort: true,
                },
                {
                    label: 'Total Session',
                    field: 'totalsession',
                    classes: 'text-right',
                    selected: true,
                    filter: {
                        isFilter: true,
                        type: 'contains',
                    },
                    isSort: true,
                },
                {
                    label: 'Page Count',
                    field: 'pagecount',
                    classes: 'text-right',
                    selected: true,
                    filter: {
                        isFilter: true,
                        type: 'contains',
                    },
                    isSort: true,
                },
                {
                    label: 'Avg. Session Duration(Sec)',
                    field: 'sessiondur',
                    classes: 'text-right',
                    selected: true,
                    filter: {
                        isFilter: true,
                        type: 'contains',
                    },
                    isSort: true,
                },
                {
                    label: 'Avg. Page Per Session',
                    field: 'avg_nop_in_session',
                    classes: 'text-right',
                    selected: true,
                    filter: {
                        isFilter: true,
                        type: 'contains',
                    },
                    isSort: true,
                },
                {
                    label: 'Order Total',
                    field: 'ordertotal',
                    classes: 'text-right',
                    selected: true,
                    filter: {
                        isFilter: true,
                        type: 'contains',
                    },
                    isSort: true,
                },
                {
                    label: 'Order Count',
                    field: 'ordercount',
                    classes: 'text-right',
                    selected: true,
                    filter: {
                        isFilter: true,
                        type: 'contains',
                    },
                    isSort: true,
                },
                {
                    label: 'Conversion Rate(%)',
                    field: 'conversionrate',
                    classes: 'text-right',
                    selected: true,
                    filter: {
                        isFilter: true,
                        type: 'contains',
                    },
                    isSort: true,
                },
                {
                    label: 'Bounce Rate(%)',
                    field: 'bouncerate',
                    classes: 'text-right',
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
    data: []
};

export const PANEL_DUMMY: any = {
    panels: [
        { label: '', collapsed: false },
        { label: '', collapsed: false },
    ],
};


export const VISUAL_CHART_DATA: VisualChart =
{
    charts: [
        {
            highchart: {

                chart: {
                    type: 'column',
                    zoomType: 'x'
                },
                title: {
                    text: 'Campaign Overview Chart'
                },
                tooltip: {
                    // pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>',
                    headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                    pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                        '<td style="padding:0"><b>{point.y:.0f} </b></td></tr>',
                    footerFormat: '</table>',
                    shared: true,
                    useHTML: true
                },
                plotOptions: {
                    bar: {
                        dataLabels: {
                            enabled: false
                        },
                        showInLegend: true
                    },
                    column: {
                        pointPadding: 0.2,
                        borderWidth: 0
                    }
                },
                exporting: {
                    enabled: true,
                    sourceWidth: 1300,
                    sourceHeight: 3000,
                },
                xAxis: {
                    categories: ['search', 'news', 'spring_sale', 'category', 'website', 'partner', 'sample_123', 'spring+1', 'shoes', 'spring'], title: {
                        text: null
                    },
                    crosshair: true
                },
                yAxis: [
                    {
                        labels: {
                            format: '{value}',
                            style: {
                                color: '#7cb5ec'
                            }
                        },
                        title: {
                            text: 'Sessions',
                            style: {
                                color: '#7cb5ec'
                            }
                        }
                    }, {
                        title: {
                            text: 'Pages',
                            style: {
                                color: '#434348'
                            }
                        },
                        labels: {
                            format: '{value} ',
                            style: {
                                color: '#434348'
                            }
                        },
                    }, {
                        title: {
                            text: 'Order Total',
                            style: {
                                color: '#90ed7d'
                            }
                        },
                        labels: {
                            format: '${value} ',
                            style: {
                                color: '#90ed7d'
                            }
                        },
                    }, {
                        title: {
                            text: 'Order Count',
                            style: {
                                color: '#f7a35c'
                            }
                        },
                        labels: {
                            format: '{value} ',
                            style: {
                                color: '#f7a35c'
                            }
                        },
                        opposite: true,
                    }, {
                        title: {
                            text: 'Conversion Rate',
                            style: {
                                color: '#8085e9'
                            }
                        },
                        labels: {
                            format: '{value}% ',
                            style: {
                                color: '#8085e9'
                            }
                        },
                        opposite: true,
                    }, {
                        title: {
                            text: 'Bounce Rate',
                            style: {
                                color: '#f15c80'
                            }
                        },
                        labels: {
                            format: '{value}%',
                            style: {
                                color: '#f15c80'
                            }
                        },
                        opposite: true
                    }
                ],
                series: [
                    {
                        name: 'Sessions',
                        data: [],
                        yAxis: 0
                    },
                    {
                        name: 'Pages',
                        data: [],
                        yAxis: 1
                    },
                    {
                        name: 'Order Total',
                        data: [],
                        yAxis: 2
                    },
                    {
                        name: 'Order Count',
                        data: [],
                        yAxis: 3
                    },
                    {
                        name: 'Conversion Rate',
                        data: [],
                        yAxis: 4
                    },
                    {
                        name: 'Bounce Rate',
                        data: [],
                        yAxis: 5
                    },
                ] as Highcharts.SeriesOptionsType[],
            },

        },
    ],
};

export const MA_DETAIL_CHART: VisualChart =
{
    charts: [
        {
            highchart: {

                chart: {
                    type: 'column',
                    zoomType: 'x'
                },
                title: {
                    text: 'Campaign Detail Trend'
                },
                tooltip: {
                    // pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>',
                    headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                    pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                        '<td style="padding:0"><b>{point.y:.0f} </b></td></tr>',
                    footerFormat: '</table>',
                    shared: true,
                    useHTML: true
                },
                plotOptions: {
                    bar: {
                        dataLabels: {
                            enabled: false
                        },
                        showInLegend: true
                    },
                    column: {
                        pointPadding: 0.2,
                        borderWidth: 0
                    }
                },
                exporting: {
                    enabled: true,
                    sourceWidth: 1300,
                    sourceHeight: 3000,
                },
                xAxis: {
                    type: 'datetime',
                    labels: { format: '{value:%e %b\'%y %H:%M}' },
                    crosshair: false
                },
                yAxis: [
                    {
                        labels: {
                            format: '{value}',
                            style: {
                                color: '#7cb5ec'
                            }
                        },
                        title: {
                            text: 'Sessions',
                            style: {
                                color: '#7cb5ec'
                            }
                        }
                    }, {
                        title: {
                            text: 'Pages',
                            style: {
                                color: '#434348'
                            }
                        },
                        labels: {
                            format: '{value} ',
                            style: {
                                color: '#434348'
                            }
                        },
                    }, {
                        title: {
                            text: 'Order Total',
                            style: {
                                color: '#90ed7d'
                            }
                        },
                        labels: {
                            format: '${value} ',
                            style: {
                                color: '#90ed7d'
                            }
                        },
                    }, {
                        title: {
                            text: 'Order Count',
                            style: {
                                color: '#f7a35c'
                            }
                        },
                        labels: {
                            format: '{value} ',
                            style: {
                                color: '#f7a35c'
                            }
                        },
                        opposite: true,
                    }, {
                        title: {
                            text: 'Conversion Rate',
                            style: {
                                color: '#8085e9'
                            }
                        },
                        labels: {
                            format: '{value}% ',
                            style: {
                                color: '#8085e9'
                            }
                        },
                        opposite: true,
                    }, {
                        title: {
                            text: 'Bounce Rate',
                            style: {
                                color: '#f15c80'
                            }
                        },
                        labels: {
                            format: '{value}%',
                            style: {
                                color: '#f15c80'
                            }
                        },
                        opposite: true
                    }
                ],
                series: [
                    {
                        name: 'Sessions',
                        type: 'spline',
                        data: [],
                        'tooltip': {
                            valueSuffix: ''
                        },
                        yAxis: 0
                    },
                    {
                        name: 'Pages',
                        type: 'spline',
                        data: [],
                        'tooltip': {
                            valueSuffix: ''
                        },
                        yAxis: 1
                    },
                    {
                        name: 'Order Total',
                        type: 'spline',
                        data: [],
                        'tooltip': {
                            valueSuffix: ''
                        },
                        yAxis: 2
                    },
                    {
                        name: 'Order Count',
                        type: 'spline',
                        data: [],
                        'tooltip': {
                            valueSuffix: ''
                        },
                        yAxis: 3
                    },
                    {
                        name: 'Conversion Rate',
                        type: 'spline',
                        data: [],
                        'tooltip': {
                            valueSuffix: ''
                        },
                        yAxis: 4
                    },
                    {
                        name: 'Bounce Rate',
                        type: 'spline',
                        data: [],
                        'tooltip': {
                            valueSuffix: ''
                        },
                        yAxis: 5
                    },
                ] as Highcharts.SeriesOptionsType[],
            },

        },
    ],
};

