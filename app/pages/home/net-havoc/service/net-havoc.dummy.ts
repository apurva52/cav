import { Table } from "src/app/shared/table/table.model";
import { netHavocTable } from "./net-havoc.model";


export const NET_HAVOC_DATA: netHavocTable = {
    havocStates: [
        {
            count: '100',
            status: 'Completed',
            label: 'Havocs',
            toggleField: false,
            borderColor: '#53b771',
        },
        {
            count: '25',
            status: 'Failed',
            label: 'Havocs',
            toggleField: false,
            borderColor: '#e91224',
        },
        {
            count: '40',
            status: 'Stopped',
            label: 'Havocs',
            toggleField: false,
            borderColor: '#cecece',
        },
        {
            count: '100',
            status: 'Running',
            label: 'Havocs',
            toggleField: true,
            borderColor: '#cecece',
        },
        {
            count: '3',
            status: 'Scheduled',
            label: 'Havocs',
            toggleField: true,
            borderColor: '#16A9BD',
        }
    ],
    scnarioStates: [
        {
            count: '100',
            status: 'Completed',
            label: 'Havocs',
            toggleField: false,
            borderColor: '#53b771',
        },
        {
            count: '25',
            status: 'Failed',
            label: 'Havocs',
            toggleField: false,
            borderColor: '#e91224',
        },
        {
            count: '40',
            status: 'Stopped',
            label: 'Havocs',
            toggleField: false,
            borderColor: '#cecece',
        },
        {
            count: '100',
            status: 'Running',
            label: 'Havocs',
            toggleField: true,
            borderColor: '#cecece',
        },
        {
            count: '3',
            status: 'Scheduled',
            label: 'Havocs',
            toggleField: true,
            borderColor: '#16A9BD',
        }
    ],
    charts: [
        {
            title: 'Havoc Distribution',
            highchart: {
              chart: {
                type: 'pie',
                height:'190px'
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
                formatter: function() {
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
          },
        {
            title: 'Scenario Distribution',
            highchart: {
              chart: {
                type: 'pie',
                height:'190px'
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
                formatter: function() {
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
          },
      ],
      targetDetails:{
        paginator: {
          first: 1,
          rows: 33,
          rowsPerPageOptions: [ 5, 10, 25, 50, 100],
      },
        headers: [
          {
              cols: [
                  {
                      label: 'Status',
                      valueField: 'status',
                      classes: 'text-left',
                      iconField: true,
                  },
                  {
                      label: 'IP',
                      valueField: 'ip',
                      classes: 'text-left',
                  },
                  {
                      label: 'duration',
                      valueField: 'duration',
                      classes: 'text-left',
                  }
                  
              ],
          },
      ],
      data: [
          {
            status: 'Active',
            ip: '10.10.50.6',
            duration: 'Last Attacked : 20 Days  ago',
            icon: 'icons8 icons8-ok',
          },
          {
            status: 'Active',
            ip: '10.10.50.6',
            duration: 'Last Attacked : 20 Days  ago',
            icon: 'icons8 icons8-ok',
          },
          {
            status: 'Active',
            ip: '10.10.50.6',
            duration: 'Last Attacked : 20 Days  ago',
            icon: 'icons8 icons8-ok',
          },
          {
            status: 'Active',
            ip: '10.10.50.6',
            duration: 'Last Attacked : 20 Days  ago',
            icon: 'icons8 icons8-ok',
          },
      ],
      }
     
};