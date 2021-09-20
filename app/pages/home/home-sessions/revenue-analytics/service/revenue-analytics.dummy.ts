
import { Table } from 'src/app/shared/table/table.model';
import { RASummaryData, RevenueAnalyticsTable } from './revenue-analytics.model';

export const REVENUE_ANALYTICS_TABLE_DATA: RevenueAnalyticsTable = {


  charts: [
    {
      title: 'Page Performance Report - Favourite Panel',
      highchart: {
        chart: {
          type: 'bar',
          height: '250px'
        },

        title: {
          text: null,
        },

        xAxis: {
          categories: ['40', '30', '20', '10', '0']
        },
        yAxis: {
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
        exporting: {
                    enabled: true,
                    sourceWidth: 1300,
                    sourceHeight: 3000,
                },
        legend: {
          layout: 'vertical',
          align: 'right',
          enabled: true,
          verticalAlign: 'middle',
          x: 0,
          y: 0,
        },
        series: [{
          name: 'John',
          data: [5, 3, 4, 7, 2]
        }, {
          name: 'Jane',
          data: [2, 2, 3, 2, 1]
        }, {
          name: 'Joe',
          data: [3, 4, 4, 2, 5]
        }] as Highcharts.SeriesOptionsType[],
      },
    },
  ],

  severityCondition: 'severity',

};

export const RA_GRAPH0_DATA = {
  title: '',
  highchart: {
    credits: {
      enabled: false
    },
    chart: {
      zoomType: 'x'
    },
    title: {
      text: 'Page Performance vs Revenue'
    },
    tooltip: {
      shared: true
      // pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>',
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
      title: {
        text: 'onload (sec)'
      },
      crosshair: true
    },
    yAxis: [
      { // Primary yAxis
        labels: {
          format: '{value}',
        },
        title: {
          text: 'Sessions',
        }
      },
      { // Secondary yAxis
        gridLineWidth: 0,
        title: {
          text: 'Page Views',
        },
        labels: {
          format: '{value}',
        }
      },
      { // Tertiary yAxis
        gridLineWidth: 0,
        title: {
          text: 'Order Total',
        },
        labels: {
          format: '${value}',
        },
        opposite: true
      }, { // forth yAxis
        gridLineWidth: 0,
        title: {
          text: 'Order Count',
        },
        labels: {
          format: '{value}',
        },
        opposite: true
      },
      { // fifth yAxis
        gridLineWidth: 0,
        title: {
          text: 'Conversion Rate',
        },
        labels: {
          format: '{value}%',
        },
        opposite: true
      }
    ],
    series: [
      {
        'name': 'Sessions',
        'type': 'area',
        'yAxis': 0,
        'data': [],
        'marker': {
          'enabled': false
        },
        'tooltip': {
          valueSuffix: ''
        }
      },
      {
        'name': 'Page views',
        'type': 'spline',
        'yAxis': 1,
        'data': [],
        'marker': {
          'enabled': false
        },
        'tooltip': {
          valueSuffix: ''
        }
      },
      {
        'name': 'Order total',
        'type': 'spline',
        'yAxis': 2,
        'marker': {
          'enabled': false
        },
        'data': [],
        'tooltip': {
          valueSuffix: ' $'
        }
      },
      {
        'name': 'Order count',
        'yAxis': 3,
        'type': 'spline',
        'data': [],
        'marker': {
          'enabled': false
        },
        'tooltip': {
          valueSuffix: ''
        }
      },
      {
        'name': 'Conversion rate',
        'type': 'spline',
        'yAxis': 4,
        'data': [],
        'marker': {
          'enabled': false
        },
        'tooltip': {
          valueSuffix: ' %'
        }
      }
    ] as Highcharts.SeriesOptionsType[],
  } as Highcharts.Options 
}

export const RA_GRAPH1_DATA = {
  title: '',
  highchart: {
    credits: {
      enabled: false
    },
    chart: {
      zoomType: 'x',
    },
    title: {
      text: 'Optimized Page Performance Metric vs Revenue Gain Per Day'
    },
    tooltip: {
      shared: true
      // pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>',
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
    xAxis: [{
      crosshair: true,
      title: {
        text: 'onload (sec)'
      }
    }
    ],
    yAxis: [
      {
        title: {
          text: 'Revenue opportunity per day'
        },
        labels: {
          formatter: function () {
            return '$' + this.value
          }
        }
      }
    ],
    series: [
      {
        name: 'Revenue',
        data: []
      }
    ] as Highcharts.SeriesOptionsType[]
  } as Highcharts.Options
}

export const RA_GRAPH2_DATA = {
  title: '',
  highchart:  {
    credits: {
      enabled: false
    },
    chart: {
      zoomType: 'x',
    },
    title: {
      text: 'Page Performance Improvement vs Revenue Gain Per Day'
    },
    tooltip: {
      shared: true
      // pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>',
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
    xAxis: [{
      crosshair: true,
      title: {
        text: 'onload (sec)'
      }
    }
    ],
    yAxis: [
      {
        title: {
          text: 'Revenue opportunity per day'
        },
        labels: {
          formatter: function () {
            return '$' + this.value
          }
        }
      }
    ],
    series: [
      {
        name: 'Revenue',
        data: []
      }
    ] as Highcharts.SeriesOptionsType[]
  } as Highcharts.Options
};

export const RA_TABLE: Table = {

  paginator: {
      first: 1,
      rows: 10,
      rowsPerPageOptions: [10, 25, 50, 100],
  },

  headers: [
      {
          cols: [
              {
                  label: 'Page Name',
                  field: 'pagename',
                  classes: 'text-left',
                  selected: true,
                  filter: {
                      isFilter: true,
                      type: 'contains',
                  },
                  isSort: true,
              },
              {
                  label: 'onLoad(sec)',
                  field: 'metric',
                  classes: 'text-right',
                  selected: true,
                  filter: {
                      isFilter: true,
                      type: 'contains',
                  },
                  isSort: true,
              },
              {
                  label: 'Optimal onLoad (sec)',
                  field: 'optimalMetricValue',
                  classes: 'text-right',
                  selected: true,
                  filter: {
                      isFilter: true,
                      type: 'contains',
                  },
                  isSort: true,
              },
              {
                label: 'Revenue Opportunity ',
                tooltip: 'Revenue Opportunity',
                field: 'formattedraLoss',
                classes: 'text-right',
                selected: true,
                filter: {
                    isFilter: true,
                    type: 'contains',
                },
                isSort: true,
              },
              {
                  label: '% of traffic slower than  optimal page speed',
                  tooltip: '% traffic slower than optimal page speed',
                  field: 'formattedraLoss',
                  classes: 'text-right',
                  selected: true,
                  filter: {
                      isFilter: true,
                      type: 'contains',
                  },
                  isSort: true,
              },
              {
                  label: 'What if web page loads 1 sec faster',
                  tooltip: 'Revenue opportunity per day if web page loads 1 sec faster',
                  field: 'formattedonesecgain',
                  classes: 'text-right',
                  selected: true,
                  filter: {
                      isFilter: true,
                      type: 'contains',
                  },
                  isSort: true,
              },
              {
                  label: 'What if web page loads 2 sec faster',
                  tooltip: 'Revenue opportunity per day if web page loads 2 sec faster',
                  field: 'formattedtwosecgain',
                  classes: 'text-right',
                  selected: true,
                  filter: {
                      isFilter: true,
                      type: 'contains',
                  },
                  isSort: true,
              },
              {
                  label: 'What if web page loads 3 sec faster',
                  tooltip: 'Revenue opportunity per day if web page loads 3 sec faster',
                  field: 'formattedthreesecgain',
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

export const RA_SUMMARY_DUMMY_DATA: RASummaryData =  {
  avgMetricValue: '0 sec',
  avgOptimalMetricValue: '0 sec',
  avgSlowerOptimalPct: '0%',
  totalRAloss: '$0',
  totalRevenueGain1s: '$0',
  totalRevenueGain2s: '$0',
  totalRevenueGain3s: '$0',
  totalRevenue: '$0.00'
};
