import { CpuBurst } from "./cpu-burst.model";


export const CPU_BURST_CHART: CpuBurst = {

    charts: [
      
        {
            title: '',
           
            highchart: {
                chart: {
                    height: '180px'
                },
                credits:{
                    enabled: false
                },

                title: {
                    
                    text: '',
                },

                xAxis: {
                    labels: {
                        enabled: true
                    },
                    categories: ['40', '30', '20', '10', '0']
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: ''
                    },
                    labels: {
                        enabled: true
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

    ]
};