import { SystemTable } from "./system.model";
 //import worldMap from "@highcharts/map-collection/custom/world.geo.json";
import * as testWorldMap from 'src/assets/dummyData/geo-location-data/custom/world.geo.json';
import { EndToEndGraphicalView } from "src/app/pages/end-to-end/end-to-end-graphical/service/end-to-end-graphical.model";


export const SYSTEM_TABLE: SystemTable = {

    charts: [
        // {
        //     title: 'End-to-End Tier Status',
        //     pagelink:'/end-to-end',
        //     highchart: {
        //         chart: {
        //             type: 'bar',
        //             height: '180px'
        //         },

        //         title: {
        //             text: null,
        //         },

        //         xAxis: {
        //             categories: ['40', '30', '20', '10', '0']
        //         },
        //         yAxis: {
        //             min: 0,
        //             title: {
        //                 text: ''
        //             }
        //         },
        //         tooltip: {
        //             pointFormat:
        //                 '{series.name} had stockpiled <b>{point.y:,.0f}</b><br/>warheads in {point.x}',
        //         },
        //         plotOptions: {
        //             series: {
        //                 stacking: 'normal'
        //             }
        //         },
        //         legend: {
        //             layout: 'vertical',
        //             align: 'right',
        //             enabled: false,
        //             verticalAlign: 'middle',
        //             x: 0,
        //             y: 0,
        //         },
        //         // series: [{
        //         //     name: 'John',
        //         //     data: [5, 3, 4, 7, 2]
        //         // }, {
        //         //     name: 'Jane',
        //         //     data: [2, 2, 3, 2, 1]
        //         // }, {
        //         //     name: 'Joe',
        //         //     data: [3, 4, 4, 2, 5]
        //         // }] as Highcharts.SeriesOptionsType[],
        //     },
        // },
        // {
        //     title: 'Geo Location',
        //     pagelink:'/geo-location',
        //     highchart: {
        //         chart: {
        //             type: 'bar',
        //             height: '180px'
        //         },

        //         title: {
        //             text: null,
        //         },

        //         xAxis: {
        //             labels: {
        //                 enabled: false
        //             },
        //             categories: ['40', '30', '20', '10', '0']
        //         },
        //         yAxis: {
        //             min: 0,
        //             title: {
        //                 text: ''
        //             },
        //             labels: {
        //                 enabled: false
        //             }
        //         },
        //         tooltip: {
        //             pointFormat:
        //                 '{series.name} had stockpiled <b>{point.y:,.0f}</b><br/>warheads in {point.x}',
        //         },
        //         plotOptions: {
        //             series: {
        //                 stacking: 'normal'
        //             }
        //         },
        //         legend: {
        //             layout: 'vertical',
        //             align: 'right',
        //             enabled: false,
        //             verticalAlign: 'middle',
        //             x: 0,
        //             y: 0,
        //         },
        //         // series: [{
        //         //     name: 'John',
        //         //     data: [5, 3, 4, 7, 2]
        //         // }, {
        //         //     name: 'Jane',
        //         //     data: [2, 2, 3, 2, 1]
        //         // }, {
        //         //     name: 'Joe',
        //         //     data: [3, 4, 4, 2, 5]
        //         // }] as Highcharts.SeriesOptionsType[],
        //     },
        // },
        {
            title: 'KPI',
            pagelink: '/kpi',
            highchart: {
                chart: {
                    type: 'column',
                    height: '180px'
                },
                title: {
                    align: 'left',
                    text: '<span style="font-size: 14px;float:left">Total Predicted Order vs Actual Order</span>',
                },
                xAxis: {
                    categories: [
                        'Jan',
                        'Feb',
                        'Mar',
                        'Apr',
                    ],
                    labels: {
                        enabled: false
                    },
                    crosshair: true
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: ''
                    },
                    labels: {
                        enabled: false
                    }
                },
                tooltip: {
                    headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                    pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                        '<td style="padding:0"><b>{point.y:.1f} mm</b></td></tr>',
                    footerFormat: '</table>',
                    shared: true,
                    useHTML: true
                },
                plotOptions: {
                    column: {
                        pointPadding: 0.2,
                        borderWidth: 0
                    }
                },
                legend: {
                    layout: 'vertical',
                    align: 'right',
                    enabled: true,
                    verticalAlign: 'top',
                    x: 0,
                    y: 0,
                    itemMarginBottom: 5,
                    symbolRadius: 0,
                    symbolHeight: 15,
                    symbolWidth: 15
                },
                series: [{
                    name: 'Tokyo',
                    data: [49.9, 71.5, 106.4, 129.2]

                }, {
                    name: 'New York',
                    data: [83.6, 78.8, 98.5, 93.4]

                }] as Highcharts.SeriesOptionsType[],
            },
        },
        {
            title: 'System Infrastructure',
            pagelink: '/',
            highchart: {
                chart: {
                    height: '180px'
                },

                title: {
                    align: 'left',
                    text: '<span style="font-size: 14px;float:left">TCP Receive Throughput(kbps)</span>',
                },

                xAxis: {
                    labels: {
                        enabled: false
                    },
                    categories: ['40', '30', '20', '10', '0']
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: ''
                    },
                    labels: {
                        enabled: false
                    }
                },
                tooltip: {
                    pointFormat:
                        '{series.name} had stockpiled <b>{point.y:,.0f}</b><br/>warheads in {point.x}',
                },
                plotOptions: {
                    series: {
                        stacking: 'normal'
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
                series: [{
                    name: 'Installation',
                    data: [40, 70, 15, 30, 30, 85, 75, 65]
                }] as Highcharts.SeriesOptionsType[],
            },
        },
        {
            title: 'DB Monitoring',
            pagelink: '/db-monitoring',
            highchart: {
                chart: {
                    height: '180px'
                },

                title: {
                    align: 'left',
                    text: '<span style="font-size: 14px;float:left">Vision Store Size Change</span>',
                },

                xAxis: {
                    labels: {
                        enabled: false
                    },
                    categories: ['40', '30', '20', '10', '0']
                },
                yAxis: {
                    labels: {
                        enabled: false
                    },
                    min: 0,
                    title: {
                        text: ''
                    }
                },
                tooltip: {
                    pointFormat:
                        '{series.name} had stockpiled <b>{point.y:,.0f}</b><br/>warheads in {point.x}',
                },
                plotOptions: {
                    series: {
                        stacking: 'normal'
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
                series: [{
                    name: 'Installation',
                    data: [30, 50, 15, 20, 23, 60, 45, 50]
                }] as Highcharts.SeriesOptionsType[],
            },
        },

    ],

    
    monitorsData: [
        {
            label: 'Time',
            value: '04/11/2020 01:04:23'
        },
        {
            label: 'Agent Start Time',
            value: '04/11/2020 01:04:23'
        },
        {
            label: 'Component',
            value: 'Instance'
        },
        {
            label: 'Tier',
            value: 'CC-E-GR-CW'
        },
        {
            label: 'Host Name',
            value: '209.51.26.108'
        },
        {
            label: 'Server',
            value: '209.51.26.108'
        },
        {
            label: 'Instance',
            value: 'Instance1_1_1_1_1'
        }
    ],
    dynamicData: [

        {
            type: 'end-to-end',
            data: [
                
            ]
        },
       {
            type: 'Chart',
            data: {
                title: 'Geo Location',
                pagelink: '/geo-location',
                highchart: {
                    chart: {
                        map: testWorldMap,
                        height: '180px'
                    },
                    title: {
                        text: "",
                    },
                    xAxis: {
                        labels: {
                            enabled: false
                        },

                    },
                    yAxis: {
                        labels: {
                            enabled: false
                        }
                    },
                    mapNavigation: {
                        enabled: false,
                        // buttonOptions: {
                        //   alignTo: "spacingBox"
                        // }
                    },
                    legend: {
                        enabled: false
                    },
                    colorAxis: {
                        min: 0
                    },
                    series: [
                        {
                            type: "map",
                            name: "Random data",
                            states: {
                                hover: {
                                    color: "#BADA55"
                                }
                            },
                            dataLabels: {
                                enabled: false,
                                format: "{point.name}"
                            },
                            allAreas: false,
                            data: [
                                ["fo", 0],
                                ["um", 1],
                                ["us", 2],
                                ["jp", 3],
                                ["sc", 4],
                                ["in", 5],
                                ["fr", 6],
                                ["fm", 7],
                                ["cn", 8],
                                ["pt", 9],
                                ["sw", 10],
                                ["sh", 11],
                                ["br", 12],
                                ["ki", 13],
                                ["ph", 14],
                                ["mx", 15],
                                ["es", 16],
                                ["bu", 17],
                                ["mv", 18],
                                ["sp", 19],
                                ["gb", 20],
                                ["gr", 21],
                                ["as", 22],
                                ["dk", 23],
                                ["gl", 24],
                                ["gu", 25],
                                ["mp", 26],
                                ["pr", 27],
                                ["vi", 28],
                                ["ca", 29],
                                ["st", 30],
                                ["cv", 31],
                                ["dm", 32],
                                ["nl", 33],
                                ["jm", 34],
                                ["ws", 35],
                                ["om", 36],
                                ["vc", 37],
                                ["tr", 38],
                                ["bd", 39],
                                ["lc", 40],
                                ["nr", 41],
                                ["no", 42],
                                ["kn", 43],
                                ["bh", 44],
                                ["to", 45],
                                ["fi", 46],
                                ["id", 47],
                                ["mu", 48],
                                ["se", 49],
                                ["tt", 50],
                                ["my", 51],
                                ["pa", 52],
                                ["pw", 53],
                                ["tv", 54],
                                ["mh", 55],
                                ["cl", 56],
                                ["th", 57],
                                ["gd", 58],
                                ["ee", 59],
                                ["ag", 60],
                                ["tw", 61],
                                ["bb", 62],
                                ["it", 63],
                                ["mt", 64],
                                ["vu", 65],
                                ["sg", 66],
                                ["cy", 67],
                                ["lk", 68],
                                ["km", 69],
                                ["fj", 70],
                                ["ru", 71],
                                ["va", 72],
                                ["sm", 73],
                                ["kz", 74],
                                ["az", 75],
                                ["tj", 76],
                                ["ls", 77],
                                ["uz", 78],
                                ["ma", 79],
                                ["co", 80],
                                ["tl", 81],
                                ["tz", 82],
                                ["ar", 83],
                                ["sa", 84],
                                ["pk", 85],
                                ["ye", 86],
                                ["ae", 87],
                                ["ke", 88],
                                ["pe", 89],
                                ["do", 90],
                                ["ht", 91],
                                ["pg", 92],
                                ["ao", 93],
                                ["kh", 94],
                                ["vn", 95],
                                ["mz", 96],
                                ["cr", 97],
                                ["bj", 98],
                                ["ng", 99],
                                ["ir", 100],
                                ["sv", 101],
                                ["sl", 102],
                                ["gw", 103],
                                ["hr", 104],
                                ["bz", 105],
                                ["za", 106],
                                ["cf", 107],
                                ["sd", 108],
                                ["cd", 109],
                                ["kw", 110],
                                ["de", 111],
                                ["be", 112],
                                ["ie", 113],
                                ["kp", 114],
                                ["kr", 115],
                                ["gy", 116],
                                ["hn", 117],
                                ["mm", 118],
                                ["ga", 119],
                                ["gq", 120],
                                ["ni", 121],
                                ["lv", 122],
                                ["ug", 123],
                                ["mw", 124],
                                ["am", 125],
                                ["sx", 126],
                                ["tm", 127],
                                ["zm", 128],
                                ["nc", 129],
                                ["mr", 130],
                                ["dz", 131],
                                ["lt", 132],
                                ["et", 133],
                                ["er", 134],
                                ["gh", 135],
                                ["si", 136],
                                ["gt", 137],
                                ["ba", 138],
                                ["jo", 139],
                                ["sy", 140],
                                ["mc", 141],
                                ["al", 142],
                                ["uy", 143],
                                ["cnm", 144],
                                ["mn", 145],
                                ["rw", 146],
                                ["so", 147],
                                ["bo", 148],
                                ["cm", 149],
                                ["cg", 150],
                                ["eh", 151],
                                ["rs", 152],
                                ["me", 153],
                                ["tg", 154],
                                ["la", 155],
                                ["af", 156],
                                ["ua", 157],
                                ["sk", 158],
                                ["jk", 159],
                                ["bg", 160],
                                ["qa", 161],
                                ["li", 162],
                                ["at", 163],
                                ["sz", 164],
                                ["hu", 165],
                                ["ro", 166],
                                ["ne", 167],
                                ["lu", 168],
                                ["ad", 169],
                                ["ci", 170],
                                ["lr", 171],
                                ["bn", 172],
                                ["iq", 173],
                                ["ge", 174],
                                ["gm", 175],
                                ["ch", 176],
                                ["td", 177],
                                ["kv", 178],
                                ["lb", 179],
                                ["dj", 180],
                                ["bi", 181],
                                ["sr", 182],
                                ["il", 183],
                                ["ml", 184],
                                ["sn", 185],
                                ["gn", 186],
                                ["zw", 187],
                                ["pl", 188],
                                ["mk", 189],
                                ["py", 190],
                                ["by", 191],
                                ["cz", 192],
                                ["bf", 193],
                                ["na", 194],
                                ["ly", 195],
                                ["tn", 196],
                                ["bt", 197],
                                ["md", 198],
                                ["ss", 199],
                                ["bw", 200],
                                ["bs", 201],
                                ["nz", 202],
                                ["cu", 203],
                                ["ec", 204],
                                ["au", 205],
                                ["ve", 206],
                                ["sb", 207],
                                ["mg", 208],
                                ["is", 209],
                                ["eg", 210],
                                ["kg", 211],
                                ["np", 212]
                            ]
                        }] as Highcharts.SeriesOptionsType[],
                },
            },
        },
        
        {
            type: 'Chart',
            data: {
                title: 'KPI',
                pagelink: '/kpi',
                highchart: {
                    chart: {
                        type: 'column',
                        height: '180px'
                    },
                    title: {
                        align: 'left',
                        text: '<span style="font-size: 14px;float:left">Total Predicted Order vs Actual Order</span>',
                    },
                    xAxis: {
                        categories: [
                            'Jan',
                            'Feb',
                            'Mar',
                            'Apr',
                        ],
                        labels: {
                            enabled: false
                        },
                        crosshair: true
                    },
                    yAxis: {
                        min: 0,
                        title: {
                            text: ''
                        },
                        labels: {
                            enabled: false
                        }
                    },
                    tooltip: {
                        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                        pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                            '<td style="padding:0"><b>{point.y:.1f} mm</b></td></tr>',
                        footerFormat: '</table>',
                        shared: true,
                        useHTML: true
                    },
                    plotOptions: {
                        column: {
                            pointPadding: 0.2,
                            borderWidth: 0
                        }
                    },
                    legend: {
                        layout: 'vertical',
                        align: 'right',
                        enabled: true,
                        verticalAlign: 'top',
                        x: 0,
                        y: 0,
                        itemMarginBottom: 5,
                        symbolRadius: 0,
                        symbolHeight: 15,
                        symbolWidth: 15
                    },
                    series: [{
                        name: 'Tokyo',
                        data: [49.9, 71.5, 106.4, 129.2]

                    }, {
                        name: 'New York',
                        data: [83.6, 78.8, 98.5, 93.4]

                    }] as Highcharts.SeriesOptionsType[],
                },
            }
        },
        {
            type: 'Chart',
            data: {
                title: 'System Infrastructure',
                pagelink: '/',
                highchart: {
                    chart: {
                        height: '180px'
                    },

                    title: {
                        align: 'left',
                        text: '<span style="font-size: 14px;float:left">TCP Receive Throughput(kbps)</span>',
                    },

                    xAxis: {
                        labels: {
                            enabled: false
                        },
                        categories: ['40', '30', '20', '10', '0']
                    },
                    yAxis: {
                        min: 0,
                        title: {
                            text: ''
                        },
                        labels: {
                            enabled: false
                        }
                    },
                    tooltip: {
                        pointFormat:
                            '{series.name} had stockpiled <b>{point.y:,.0f}</b><br/>warheads in {point.x}',
                    },
                    plotOptions: {
                        series: {
                            stacking: 'normal'
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
                    series: [{
                        name: 'Installation',
                        data: [40, 70, 15, 30, 30, 85, 75, 65]
                    }] as Highcharts.SeriesOptionsType[],
                },
            }
        },
        {
            type: 'Chart',
            data: {
                title: 'DB Monitoring',
                pagelink: '/db-monitoring',
                highchart: {
                    chart: {
                        height: '180px'
                    },

                    title: {
                        align: 'left',
                        text: '<span style="font-size: 14px;float:left">Vision Store Size Change</span>',
                    },

                    xAxis: {
                        labels: {
                            enabled: false
                        },
                        categories: ['40', '30', '20', '10', '0']
                    },
                    yAxis: {
                        labels: {
                            enabled: false
                        },
                        min: 0,
                        title: {
                            text: ''
                        }
                    },
                    tooltip: {
                        pointFormat:
                            '{series.name} had stockpiled <b>{point.y:,.0f}</b><br/>warheads in {point.x}',
                    },
                    plotOptions: {
                        series: {
                            stacking: 'normal'
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
                    series: [{
                        name: 'Installation',
                        data: [30, 50, 15, 20, 23, 60, 45, 50]
                    }] as Highcharts.SeriesOptionsType[],
                },
            }
        },
        {
            type: 'Monitor-Card',
            data: [
                {
                    label: 'Time',
                    value: '04/11/2020 01:04:23'
                },
                {
                    label: 'Agent Start Time',
                    value: '04/11/2020 01:04:23'
                },
                {
                    label: 'Component',
                    value: 'Instance'
                },
                {
                    label: 'Tier',
                    value: 'CC-E-GR-CW'
                },
                {
                    label: 'Host Name',
                    value: '209.51.26.108'
                },
                {
                    label: 'Server',
                    value: '209.51.26.108'
                },
                {
                    label: 'Instance',
                    value: 'Instance1_1_1_1_1'
                }
            ]
        }
    ]

};
export const END_TO_END_VIEW: EndToEndGraphicalView ={
    node: [
        {
          transactionScorecard: {
            label: 'Transaction Scorecard',
            transScoreSeverity: [
              {
                label: 'Normal',
                color: '#707070',
                avg: 75,
                data: 166151,
                percentage: 91,
              },
              {
                label: 'Slow',
                avg: 4036,
                color: '#FADADB',
                data: 25,
                percentage: 0,
              },
              {
                label: 'Very Slow',
                avg: 0,
                color: '#F6B4B4',
                data: 0,
                percentage: 0,
              },
              {
                label: 'Errors',
                avg: 4,
                color: '#F04943',
                data: 17338,
                percentage: 9,
              },
            ],
          },
          nodeHealthInfo: [
            {
              label: 'Alerts',
              nodeHealthData: [
                {
                  label: 'Minor',
                  color: '#FADADB',
                  value: '0',
                  propValue: 0,
                  percentage: 56,
                },
                {
                  label: 'Major',
                  color: '#F6B4B4',
                  value: '0',
                  propValue: 0,
                  percentage: 24,
                },
                {
                  label: 'Critical',
                  color: '#F04943',
                  value: '0',
                  propValue: 0,
                  percentage: 20,
                },
              ],
            },
            {
              label: 'Business Health',
              nodeHealthData: [
                {
                  label: 'Normal',
                  color: '#707070',
                  value: '0',
                  propValue: 0,
                  percentage: 56,
                },
                {
                  label: 'Major',
                  color: '#F6B4B4',
                  value: '0',
                  propValue: 0,
                  percentage: 24,
                },
                {
                  label: 'Critical',
                  color: '#F04943',
                  value: '0',
                  propValue: 0,
                  percentage: 20,
                },
              ],
            },
            {
              label: 'Server Health',
              nodeHealthData: [
                {
                  label: 'Normal',
                  color: '#707070',
                  value: '0',
                  propValue: 0,
                  percentage: 56,
                },
                {
                  label: 'Major',
                  color: '#F6B4B4',
                  value: '0',
                  propValue: 0,
                  percentage: 24,
                },
                {
                  label: 'Critical',
                  color: '#F04943',
                  value: '0',
                  propValue: 0,
                  percentage: 20,
                },
              ],
            },
            {
              label: 'Integration Point Health',
              nodeHealthData: [
                {
                  label: 'Normal',
                  color: '#707070',
                  value: '0',
                  propValue: 0,
                  percentage: 56,
                },
                {
                  label: 'Major',
                  color: '#F6B4B4',
                  value: '0',
                  propValue: 0,
                  percentage: 24,
                },
                {
                  label: 'Critical',
                  color: '#F04943',
                  value: '0',
                  propValue: 0,
                  percentage: 20,
                },
              ],
            },
          ],
          eventAlertCount: 8,
          businessHealthCount: 0,
          serverHealthCount: 1,
          ipHealthCount: 0,
          transactionScorecardCount: 12,
          icon: './assets/icons8-png/icons8-database-100.png',
          nodeName: 'Database',
          from: 'crop',
          to: 'cprod-blue-cscui-prod',
          cpuUtilization: 2,
          avgResTime: 1,
          tps: 2,
          callCount: 69,
          callSec: 21,
          count: 650,
          errorCount: 23,
          errorSec: 56,
          id: 'cprod-blue-cscui-prod-2',
          type: 'outputNode',
          top: 0,
          left: 259.54,
        },
        {
          transactionScorecard: {
            label: 'Transaction Scorecard',
            transScoreSeverity: [
              {
                label: 'Normal',
                color: '#707070',
                avg: 75,
                data: 166151,
                percentage: 91,
              },
              {
                label: 'Slow',
                avg: 4036,
                color: '#FADADB',
                data: 25,
                percentage: 0,
              },
              {
                label: 'Very Slow',
                avg: 0,
                color: '#F6B4B4',
                data: 0,
                percentage: 0,
              },
              {
                label: 'Errors',
                avg: 4,
                color: '#F04943',
                data: 17338,
                percentage: 9,
              },
            ],
          },
          nodeHealthInfo: [
            {
              label: 'Alerts',
              nodeHealthData: [
                {
                  label: 'Minor',
                  color: '#FADADB',
                  value: '0',
                  propValue: 0,
                  percentage: 56,
                },
                {
                  label: 'Major',
                  color: '#F6B4B4',
                  value: '0',
                  propValue: 0,
                  percentage: 24,
                },
                {
                  label: 'Critical',
                  color: '#F04943',
                  value: '0',
                  propValue: 0,
                  percentage: 20,
                },
              ],
            },
            {
              label: 'Business Health',
              nodeHealthData: [
                {
                  label: 'Normal',
                  color: '#707070',
                  value: '0',
                  propValue: 0,
                  percentage: 56,
                },
                {
                  label: 'Major',
                  color: '#F6B4B4',
                  value: '0',
                  propValue: 0,
                  percentage: 24,
                },
                {
                  label: 'Critical',
                  color: '#F04943',
                  value: '0',
                  propValue: 0,
                  percentage: 20,
                },
              ],
            },
            {
              label: 'Server Health',
              nodeHealthData: [
                {
                  label: 'Normal',
                  color: '#707070',
                  value: '0',
                  propValue: 0,
                  percentage: 56,
                },
                {
                  label: 'Major',
                  color: '#F6B4B4',
                  value: '0',
                  propValue: 0,
                  percentage: 24,
                },
                {
                  label: 'Critical',
                  color: '#F04943',
                  value: '0',
                  propValue: 0,
                  percentage: 20,
                },
              ],
            },
            {
              label: 'Integration Point Health',
              nodeHealthData: [
                {
                  label: 'Normal',
                  color: '#707070',
                  value: '0',
                  propValue: 0,
                  percentage: 56,
                },
                {
                  label: 'Major',
                  color: '#F6B4B4',
                  value: '0',
                  propValue: 0,
                  percentage: 24,
                },
                {
                  label: 'Critical',
                  color: '#F04943',
                  value: '0',
                  propValue: 0,
                  percentage: 20,
                },
              ],
            },
          ],
          eventAlertCount: 8,
          businessHealthCount: 0,
          businessHealthMajorCircum: 100,
          businessHealthCriticalCircum: 150,
          serverHealthCount: 1,
          serverHealthMajorCircum: 200,
          serverHealthCriticalCircum: 120,
          ipHealthCount: 0,
          icon: './assets/icons8-png/icons8-java-100.png',
          nodeName: 'Solar Pref',
          cpuUtilization: 2,
          avgResTime: 1,
          tps: 2,
          callCount: 69,
          id: 'cprod-blue-cscui-prod',
          type: 'solarPrefNode',
          
        },
        
      ],
      edge: [
        {
          source: 'cprod-blue-cscui-prod',
          target: 'cprod-blue-cscui-prod-2',
        },
      ],
   
    
 }