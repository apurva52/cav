import { AWSMonitoring } from "./aws-monitoring.model";




export const AWS_MONITOR_DATA: AWSMonitoring = {
    charts: [
      {
        title: null,
        highchart: {
            chart: {
                type: 'column',
                height:'250px'
            },
            title: {
                text: null
            },
            xAxis: {
                categories: ['4 Feb', '5 Feb', '6 Feb', '7 Feb', '8 Feb', '9 Feb', '10 Feb']
            },
            yAxis: {
                min: 0,
                title: {
                    text: null
                }
            },
            tooltip: {
                enabled: false
            },
            plotOptions: {
                column: {
                    stacking: 'normal',
                }
            },
            series: [{
                name: 'John',
                data: [5, 3, 4, 7, 2, 7, 2]
            }, {
                name: 'Jane',
                data: [2, 2, 3, 2, 1, 7, 2]
            }, {
                name: 'Joe',
                data: [3, 4, 4, 2, 5, 7, 2]
            },
            {
                name: 'Joe',
                data: [3, 4, 4, 2, 5, 7, 2]
            },
            {
                name: 'Joe',
                data: [3, 4, 4, 2, 5, 7, 2]
            }] as Highcharts.SeriesOptionsType[],
            credits:{
                enabled: false
            },
            legend :{
                enabled: false
            }
        },
        
      },
      
    ],

    table: {
        headers: [
          {
            cols: [
              {
                label: 'Availability Zone',
                valueField: 'zone',
                classes: 'text-left',
                filter: {
                  isFilter: true,
                  type: 'contains',
                },
                actionIcon: false
              },
              {
                label: '2 Feb',
                valueField: 'feb',
                classes: 'text-left',
                statusField: true,
                            filter: {
                  isFilter: true,
                  type: 'contains',
                },
                actionIcon: false
              },
              {
                label: 'Now',
                valueField: 'now',
                classes: 'text-left',
                statusField: true,
                            filter: {
                  isFilter: true,
                  type: 'contains',

                },
                actionIcon: true
              }
            ],
          },
        ],
        data: [
          
          {
            zone: 'US-East-1d',
            feb: '75',
            now:'75',
            icon:'icons8-up',
            borderColor: '#7cb5ec'
          },
          {
            zone: 'US-East-1d',
            feb: '75',
            now:'75',
            icon:'icons8-down',
            borderColor: '#434348'
          },
          {
            zone: 'US-East-1d',
            feb: '75',
            now:'75',
            icon:'icons8-up',
            borderColor: '#f7a35c'
          },
          {
            zone: 'US-East-1d',
            feb: '75',
            now:'75',
            icon:'icons8-up',
            borderColor: '#434348'
          }

        ],
        statsField: 'stats',
      }

  
}