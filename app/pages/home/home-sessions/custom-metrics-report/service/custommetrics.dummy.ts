import { CustomMetricsReportTable } from "./custommetrics.model";

export const CustomMetrics_TABLE: CustomMetricsReportTable = {

  paginator: {
    first: 0,
    rows: 33,
    rowsPerPageOptions: [5, 10, 25, 50, 100],
  },
  headers: [
    {
      cols: [
        {
          label: 'KeyWord',
          valueField: 'customdata',
          classes: 'text-left',
          selected: true,
          severityColorField: true,
          filter: {
            isFilter: true,
            type: 'contains',
          },
          isSort: true,
        },
        {
          label: 'Count',
          valueField: 'count',
          classes: 'text-center',
          selected: true,
          filter: {
            isFilter: true,
            type: 'contains',
          },
          isSort: true,
          severity: true,
          severityColorField: true,
        }
      ]
    }
  ],

  data: [],
  chartscorelation: [
    {
      title: 'Custom Metrics Correlation',
      highchart: {
        chart: {
          height: '400px',
          type: "spline"
        },

        title: {
          text: null
        },
        xAxis: {
          title: {
            text: 'time'
          },
          type: 'datetime',
          labels: { format: '{value:%e %b\'%y %H:%M}' }
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
          },

          { // forth yAxis
            gridLineWidth: 0,
            title: {
              text: 'Order Count',
            },
            labels: {
              format: '{value}',
            },
            opposite: true
          }, { // fifth yAxis
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
        plotOptions: {
          line: {
            dataLabels: {
              enabled: false
            },
            enableMouseTracking: false
          },
          spline: {
            marker: { enabled: false }
          },
          area: {
            marker: { enabled: false }
          }
        },
        tooltip: {
          shared: true
        },
        credits: {
          enabled: false
        },
        series: [] as Highcharts.SeriesOptionsType[],
      },
    },
  ],

  chartstrend: [
    {
      title: 'Trend For Top n Keyword',
      highchart: {
        chart: {
          type: 'spline',
          height: '400px',
        },

        title: {
          text: null
        },


        xAxis: {
          title: {
            text: 'time'
          },
          type: 'datetime',
          labels: { format: '{value:%e %b\'%y %H:%M}' }
        },
        boost: {
          enabled: false,
        },
        exporting: {
          enabled: true,
          sourceWidth: 800,
          sourceHeight: 600,
        },
        yAxis: {
          title: {
            text: 'Count'
          }
        },
        plotOptions: {
          line: {
            dataLabels: {
              enabled: false
            },
            enableMouseTracking: false
          },
          spline: {
            marker: { enabled: false }
          },
          area: {
            marker: { enabled: false }
          }
        },
        tooltip: {
          shared: true
        },
        credits: {
          enabled: false
        },
        series: [] as Highcharts.SeriesOptionsType[],
      },
    },
  ],
  chartspie: [
    {
      title: 'Custom Report Request count',
      highchart: {
        chart: {
          height: '300px',
          type: 'pie',
        },

        title: {
          text: null,
        },
        credits: {
          enabled: false
        },

        tooltip: {
          pointFormat: '<b>{point.name}</b>: {point.y:.' + 0 + 'f}' || ' <b>{point.y:.0f}</b>'
        },
        plotOptions: {
          pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
              enabled: true,
              //format:  '<b>{point.name}</b>: {point.y:.'+this.decimaplaces+'f}',
              formatter: function () {
                let a = '<b>' + this.point.name + '</b>'
                  + ' : ' + (this.point.y).toLocaleString();
                return a;
              },
              style: {
                color: 'black'
              }
            }
          }
        },
        legend: {
          layout: 'vertical',
          align: 'right',
          enabled: true,
          verticalAlign: 'middle',
          x: 0,
          y: 0,
        },
        series: [] as Highcharts.SeriesOptionsType[],
      },
    },
  ],
  severityCondition: 'severity',
  tableFilter: true,
};