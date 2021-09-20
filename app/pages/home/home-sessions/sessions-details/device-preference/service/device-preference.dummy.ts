import { DevicePrefChart } from "./device-preference.model";

export const DEVICE_PREF_CHART: DevicePrefChart = {
    charts: [
        {
            title: 'CPU Performance',
            highchart: {
                exporting: {
                    enabled: true
                },
                chart: {
                    type: 'spline',
                    height: '200px'
                },

                title: {
                    text: null,
                },


                xAxis: {
                    categories: ['00.05', '00.10.', '00.15', '00.20', '0.25']
                },
                yAxis: {
                    title: {
                        text: ''
                    }
                },
                plotOptions: {
                    line: {
                        dataLabels: {
                            enabled: false
                        },
                        enableMouseTracking: false
                    }
                },
                series: [{
                    name: 'CPUFrequency',
                    data: []
                }, {
                    name: 'CPUusedPercentage',
                    data: []
                }] as Highcharts.SeriesOptionsType[],
            },
        },
        {
            title: 'RAM Performance',
            highchart: {
                exporting: {
                    enabled: true
                },
                chart: {
                    type: 'spline',
                    height: '200px'
                },

                title: {
                    text: null,
                },


                xAxis: {
                    categories: ['00.05', '00.10.', '00.15', '00.20', '0.25']
                },
                yAxis: {
                    title: {
                        text: ''
                    }
                },
                plotOptions: {
                    line: {
                        dataLabels: {
                            enabled: false
                        },
                        enableMouseTracking: false
                    }
                },
                series: [{
                    name: "RAMavailable",
                    data: []
                }, {
                    name: "RAMTotal",
                    data: []
                }, {
                    name: "RAMUsed",
                    data: []
                }] as Highcharts.SeriesOptionsType[],
            },
        },
        {
            title: 'ROM Performance',
            highchart: {
                exporting: {
                    enabled: true
                },
                chart: {
                    type: 'spline',
                    height: '200px'
                },

                title: {
                    text: null,
                },


                xAxis: {
                    categories: ['00.05', '00.10.', '00.15', '00.20', '0.25']
                },
                yAxis: {
                    title: {
                        text: ''
                    }
                },
                plotOptions: {
                    line: {
                        dataLabels: {
                            enabled: false
                        },
                        enableMouseTracking: false
                    }
                },
                series: [{
                    name: "ROMavailable",
                    data: []
                }, {
                    name: "ROMTotal",
                    data: []
                }, {
                    name: "ROMUsed",
                    data: []
                }] as Highcharts.SeriesOptionsType[],
            },
        },
        {
            title: 'Wifi Performance',
            highchart: {
                exporting: {
                    enabled: true
                },
                chart: {
                    type: 'spline',
                    height: '200px'
                },

                title: {
                    text: null,
                },


                xAxis: {
                    categories: ['00.05', '00.10.', '00.15', '00.20', '0.25']
                },
                yAxis: {
                    title: {
                        text: ''
                    }
                },
                plotOptions: {
                    line: {
                        dataLabels: {
                            enabled: false
                        },
                        enableMouseTracking: false
                    }
                },
                series: [{
                    name: "WifiSignalStrength",
                    data: []
                }, {
                    name: "WifiLinkSpeed",
                    data: []
                }] as Highcharts.SeriesOptionsType[],
            },
        },
        {
            title: 'Battery Performance',
            highchart: {
                exporting: {
                    enabled: true
                },
                chart: {
                    type: 'spline',
                    height: '200px'
                },

                title: {
                    text: null,
                },


                xAxis: {
                    categories: ['00.05', '00.10.', '00.15', '00.20', '0.25']
                },
                yAxis: {
                    title: {
                        text: ''
                    }
                },
                plotOptions: {
                    line: {
                        dataLabels: {
                            enabled: false
                        },
                        enableMouseTracking: false
                    }
                },
                series: [{
                    name: "Battarylevel",
                    data: []
                }] as Highcharts.SeriesOptionsType[],
            },
        },
        {
            title: 'Network Performance',
            highchart: {
                exporting: {
                    enabled: true
                },
                chart: {
                    type: 'spline',
                    height: '200px'
                },

                title: {
                    text: null,
                },


                xAxis: {
                    categories: ['00.05', '00.10.', '00.15', '00.20', '0.25']
                },
                yAxis: {
                    title: {
                        text: ''
                    }
                },
                plotOptions: {
                    line: {
                        dataLabels: {
                            enabled: false
                        },
                        enableMouseTracking: false
                    }
                },
                series: [{
                    name: "NetworkRecivedbytes",
                    data: []
                },
                {
                    name: "NetworkTransmitBytes",
                    data: []
                },
                ] as Highcharts.SeriesOptionsType[],
            },
        },
    ],
    dataLoaded: [
        {
            startVal: '4.11 sec',
            endVal: '2.11 sec',
            avg: '21%'
        },
        {
            startVal: '4.11 sec',
            endVal: '2.11 sec',
            avg: '21%'
        },
        {
            startVal: '4.11 sec',
            endVal: '2.11 sec',
            avg: '21%'
        },
        {
            startVal: '4.11 sec',
            endVal: '2.11 sec',
            avg: '21%'
        },
        {
            startVal: '4.11 sec',
            endVal: '2.11 sec',
            avg: '21%'
        },
        {
            startVal: '4.11 sec',
            endVal: '2.11 sec',
            avg: '21%'
        },
        {
            startVal: '4.11 sec',
            endVal: '2.11 sec',
            avg: '21%'
        },
        {
            startVal: '4.11 sec',
            endVal: '2.11 sec',
            avg: '21%'
        },
        {
            startVal: '4.11 sec',
            endVal: '2.11 sec',
            avg: '21%'
        },
        {
            startVal: '4.11 sec',
            endVal: '2.11 sec',
            avg: '21%'
        },
        {
            startVal: '4.11 sec',
            endVal: '2.11 sec',
            avg: '21%'
        },
        {
            startVal: '4.11 sec',
            endVal: '2.11 sec',
            avg: '21%'
        },
        {
            startVal: '4.11 sec',
            endVal: '2.11 sec',
            avg: '21%'
        },
        {
            startVal: '4.11 sec',
            endVal: '2.11 sec',
            avg: '21%'
        },
    ]
};
