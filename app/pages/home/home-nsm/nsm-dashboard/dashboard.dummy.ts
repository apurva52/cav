//import { Table } from "src/app/shared/table/table.model"; 
import { Table } from "../../../../shared/table/table.model"; 
import { CntrollersNameTable} from './dashboard.model';


export const CONTROLLER_NAME_DATA: CntrollersNameTable = {

     paginator: {
     first: 1,
         rows: 10,
         rowsPerPageOptions: [10, 20, 50, 100],
     },


    headers: [
        {
            cols: [
                {
                    label: 'Sl No',
                    valueField: 'seq',
                    classes: 'text-right',
                    isSort: true,
                    filter: {
                        isFilter: true,
                        type: 'contains',
                    },
                    selected: true,
                    width: '5%'
                },
                {
                    label: 'Name',
                    valueField: 'name',
                    classes: 'text-center',
                    isSort: true,
                    filter: {
                        isFilter: true,
                        type: 'contains',
                    },
                    selected: true,
                    width: '5%'
                },
                {
                    label: 'IP',
                    valueField: 'ip',
                    classes: 'text-right',
                    isSort: true,
                    filter: {
                        isFilter: true,
                        type: 'contains',
                    },
                    selected: true ,
                     width: '5%'
                },
                {
                    label: 'Blade',
                    valueField: 'blade',
                    classes: 'text-left',
                    isSort: true,
                    filter: {
                        isFilter: true,
                        type: 'contains',
                    },
                    selected: true,
                    width: '5%'
                },
                {
                    label: 'Team',
                    valueField: 'team',
                    classes: 'text-left',
                    isSort: true,
                    filter: {
                        isFilter: true,
                        type: 'contains',
                    },
                    selected: true,
                    iconField: true,
                    width: '5%'
                },
                {
                    label: 'Project',
                    valueField: 'project',
                    classes: 'text-left',
                    isSort: true,
                    filter: {
                        isFilter: true,
                        type: 'contains',
                    },
                    selected: true,
                    iconField: true,
                    width: '5%'
                }
            ],
        },
    ],
    data: [], 
    
    
    
    charts: [
        {
            title: 'ALLOCATION',
            highchart: {
                chart: {
                    type: 'pie',
                    height: '190px'
                },

                title: {
                    text: '375',
                    align: 'center',
                    verticalAlign: 'middle',
                    y: 20,
                    x: -80
                },

                yAxis: {
                    title: {
                        text: 'Total percent market share'
                    }
                },
                plotOptions: {
                    pie: {
                        shadow: false,
                        borderColor: null
                    }
                },
                tooltip: {
                    formatter: function () {
                        return '<b>' + this.point.name + '</b>: ' + this.y + ' %';
                    }
                },
                legend: {
                    align: 'right',
                    layout: 'vertical',
                    verticalAlign: 'middle',
                    symbolRadius: 0,
                    symbolPadding: 10,
                    itemMarginTop: 10,
                    itemStyle: {
                        "color": "#000",
                        "fontSize": '12px'
                    }
                },
                series: [{
                    name: 'Browsers',
                    data: [{
                        y: 8,
                        name: "Starve Application",
                        color: "#4A4292"
                    }, {
                        y: 4,
                        name: "State Change",
                        color: "#F89B23"
                    }, {
                        y: 1,
                        name: "Network Assults",
                        color: "#16A9BD"
                    }],
                    size: '70%',
                    innerSize: '70%',
                    showInLegend: true,
                    dataLabels: {
                        enabled: false
                    },
                    marker: {
                        symbol: 'square',
                        radius: 12
                    }
                }] as Highcharts.SeriesOptionsType[],
            },
        } 
    ]
};
