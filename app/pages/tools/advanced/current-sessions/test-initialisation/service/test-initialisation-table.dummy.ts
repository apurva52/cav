import { TestInitChart, TestInitData } from "./test-initialisation.model";


export const TEST_INITIALISATION_TABLE: TestInitData = {

    paginator: {
        first: 1,
        rows: 10,
        rowsPerPageOptions: [10, 25, 50, 100],
    },

    headers: [
        {
            cols: [
                {
                    label: 'Stage',
                    valueField: 'stage',
                    classes: 'text-left',
                    selected: true,
                    filter: {
                        isFilter: true,
                        type: 'contains',
                    },
                    isSort: true,
                },
                {
                    label: 'Start Time',
                    valueField: 'startTime',
                    classes: 'text-left',
                    selected: true,
                    filter: {
                        isFilter: true,
                        type: 'contains',
                    },
                    isSort: true,
                },
                {
                    label: 'Summary',
                    valueField: 'summary',
                    classes: 'text-left',
                    selected: true,
                    filter: {
                        isFilter: true,
                        type: 'contains',
                    },
                    isSort: true,
                },
                {
                    label: 'Duration',
                    valueField: 'duration',
                    classes: 'text-left',
                    selected: true,
                    filter: {
                        isFilter: true,
                        type: 'contains',
                    },
                    isSort: true,
                    width: '35%'
                },
                {
                    label: 'Status',
                    valueField: 'status',
                    classes: 'text-left',
                    selected: true,
                    filter: {
                        isFilter: true,
                        type: 'contains',
                    },
                    isSort: true,
                    iconField: true,
                },
            ],
        },
    ],
    data: [
        {
            stage: 'Initialisation',
            startTime: '09/22/20 15:39:00',
            summary: 'Argument parsing and scenario preprocessing',
            duration: '2 secs',
            status: 'icons8 icons8-ok',
        },
        {
            stage: 'Initialisation1',
            startTime: '09/22/20 15:39:00',
            summary: 'Argument parsing and scenario preprocessing',
            duration: '2 secs',
            status: 'icons8 icons8-ok',
        },
        {
            stage: 'Initialisation2',
            startTime: '09/22/20 15:39:00',
            summary: 'Argument parsing and scenario preprocessing',
            duration: '2 secs',
            status: 'icons8 icons8-ok',
        },
        {
            stage: 'Initialisation3',
            startTime: '09/22/20 15:39:00',
            summary: 'Argument parsing and scenario preprocessing',
            duration: '2 secs',
            status: 'icons8 icons8-ok',
        },
        {
            stage: 'Initialisation4',
            startTime: '09/22/20 15:39:00',
            summary: 'Argument parsing and scenario preprocessing',
            duration: '2 secs',
            status: 'icons8 icons8-ok',
        },
        {
            stage: 'Initialisation5',
            startTime: '09/22/20 15:39:00',
            summary: 'Argument parsing and scenario preprocessing',
            duration: '2 secs',
            status: 'icons8 icons8-ok',
        },
        {
            stage: 'Initialisation6',
            startTime: '09/22/20 15:39:00',
            summary: 'Argument parsing and scenario preprocessing',
            duration: '2 secs',
            status: 'icons8 icons8-ok',
        },
        {
            stage: 'Initialisation7',
            startTime: '09/22/20 15:39:00',
            summary: 'Argument parsing and scenario preprocessing',
            duration: '2 secs',
            status: 'icons8 icons8-ok',
        },
        {
            stage: 'Initialisation8',
            startTime: '09/22/20 15:39:00',
            summary: 'Argument parsing and scenario preprocessing',
            duration: '2 secs',
            status: 'icons8 icons8-ok',
        },
        {
            stage: 'Initialisation9',
            startTime: '09/22/20 15:39:00',
            summary: 'Argument parsing and scenario preprocessing',
            duration: '2 secs',
            status: 'icons8 icons8-ok',
        },
        {
            stage: 'Initialisation10',
            startTime: '09/22/20 15:39:00',
            summary: 'Argument parsing and scenario preprocessing',
            duration: '2 secs',
            status: 'icons8 icons8-ok',
        },
        {
            stage: 'Initialisation11',
            startTime: '09/22/20 15:39:00',
            summary: 'Argument parsing and scenario preprocessing',
            duration: '2 secs',
            status: 'icons8 icons8-ok',
        },
        {
            stage: 'Initialisation12',
            startTime: '09/22/20 15:39:00',
            summary: 'Argument parsing and scenario preprocessing',
            duration: '2 secs',
            status: 'icons8 icons8-ok',
        },
        {
            stage: 'Initialisation13',
            startTime: '09/22/20 15:39:00',
            summary: 'Argument parsing and scenario preprocessing',
            duration: '2 secs',
            status: 'icons8 icons8-ok',
        },
        {
            stage: 'Initialisation14',
            startTime: '09/22/20 15:39:00',
            summary: 'Argument parsing and scenario preprocessing',
            duration: '2 secs',
            status: 'icons8 icons8-ok',
        },
        {
            stage: 'Initialisation15',
            startTime: '09/22/20 15:39:00',
            summary: 'Argument parsing and scenario preprocessing',
            duration: '2 secs',
            status: 'icons8 icons8-ok',
        },
        {
            stage: 'Initialisation16',
            startTime: '09/22/20 15:39:00',
            summary: 'Argument parsing and scenario preprocessing',
            duration: '2 secs',
            status: 'icons8 icons8-ok',
        },
        {
            stage: 'Initialisation17',
            startTime: '09/22/20 15:39:00',
            summary: 'Argument parsing and scenario preprocessing',
            duration: '2 secs',
            status: 'icons8 icons8-ok',
        },

    ],
};

export const TEST_INIT_CHART_DATA: TestInitChart =
{
    charts: [
        {
            title: 'Test Initialisation',
            highchart: {

                chart: {
                    height: '265px',
                },
                title: null,
                tooltip: {
                    pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>',
                },
                plotOptions: {
                    pie: {
                        shadow: false,
                        center: ['50%', '50%'],
                        size: '45%',
                        innerSize: '20%',
                        dataLabels: {
                            enabled: false,
                            format: '<b>{point.percentage:.1f} %',
                        },
                        showInLegend: true
                    },
                },
                series: [
                    {
                        type: 'pie',
                        name: 'Stats',
                        colorByPoint: true,
                        data: [
                            {
                                name: 'Completed',
                                y: 100,
                            },
                            {
                                name: 'Error',
                                y: 0,
                            }
                        ],
                    },
                ] as Highcharts.SeriesOptionsType[],
            },

        },
    ],
};

export const EXPANDED_TABLE_DATA = [
    { 0: '02/09/21 04:44:11 | Stage [Initialisation] started' },
    { 1: '02/09/21 04:44:11 | Session 1234567 generated' },
    { 2: '02/09/21 04:44:11 | Parsing scenario settings' },
    { 3: '02/09/21 04:44:12 | Parsing partition and multidisk keys' },
    { 4: '02/09/21 04:44:12 | Creating partition directory inside Session 1234567' },
    { 5: '02/09/21 04:44:12 | Creating partition info share memory' },
    { 6: '02/09/21 04:44:12 | Saving Partition 20210209044412' }
];