import { VisualChart } from 'src/app/shared/visualization/visual-chart/service/visual-chart.model';

export const NAVIGATION_TIMING_CHART_DATA: VisualChart = {
  charts: [
    {
      title: 'Navigation Timing',
      highchart: {
        chart: {
          height: '150px',
        },
        title: {
          text: null,
        },
        legend: {
          enabled: true,
        },
        colors: [
          '#e1ce7a', '#fbffb9', '#fdd692', '#ec7357', '#754f44', '#2d728f', '#3b8ea5', '#ab3428', '#a0a4b8'
        ],
        xAxis: {
          visible:false,
          title: {
            text: '',
            
          }
        },
        yAxis: {
          title: {
            text: 'Time(sec)',
          }          
        },
        /*
        tooltip: {
          pointFormat:
            '{series.name} had stockpiled <b>{point.y:,.0f}</b><br/>warheads in {point.x}',
        },*/
        plotOptions: {
          series: {
            stacking: 'normal',
            marker: {
              enabled: false,
              symbol: 'circle',
              radius: 2,
              states: {
                hover: {
                  enabled: true,
                },
              },
            },
          },
        },
        series: [
          {
            name: 'Load Event Time',
            type: 'bar',
            data: [],
          },
          {
            name: 'DOM',
            type: 'bar',
            data: [],
          },
          {
            name: 'Main URL Download',
            type: 'bar',
            data: [],
          },
          {
            name: 'Server Response Time',
            type: 'bar',
            data: [],
          },
          {
            name: 'SSL',
            type: 'bar',
            data: [],
          },
          {
            name: 'Connection',
            type: 'bar',
            data: [],
          },
          {
            name: 'DNS',
            type: 'bar',
            data: [],
          },
          {
            name: 'Cache Look Up',
            type: 'bar',
            data: [],
          },
          {
            name: 'Redirection',
            type: 'bar',
            data: [],
          },

        ] as Highcharts.SeriesOptionsType[],
      },
    },
  ],
};
