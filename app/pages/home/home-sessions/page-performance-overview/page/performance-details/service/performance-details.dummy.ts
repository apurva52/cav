import { Table } from "src/app/shared/table/table.model";
import { PerformanceTable } from "./performance-details.model";


export const PERFORMANCE_TABLE: PerformanceTable = {
  paginator: {
    first: 0,
    rows: 15,
    rowsPerPageOptions: [15, 30, 50, 100],
  },
  data: [],
  headers: [
    {
      cols: [
        {
          label: 'DateTime',
          valueField: 'formattedtime',
          classes: 'text-left',
          isSort: true,
        },
        {
          label: 'Page Views',
          valueField: 'pageview',
          classes: 'text-left',
          isSort: true,
        },
        {
          label: 'Onload(sec)',
          valueField: 'onload',
          classes: 'text-left',
          isSort: true,
        },
        {
          label: 'Perceived Render(sec)',
          valueField: 'prt',
          classes: 'text-left',
          isSort: true,
        },
        {
          label: 'DNS(sec)',
          valueField: 'dns',
          classes: 'text-left',
          isSort: true,
        },
        {
          label: 'TCPCon(sec)',
          valueField: 'tcp',
          classes: 'text-left',
          isSort: true,
        },
        {
          label: 'DOMComplete(sec)',
          valueField: 'dom',
          classes: 'text-left',
          isSort: true,
        },
        {
          label: 'SSL(sec)',
          valueField: 'ssl',
          classes: 'text-left',
          isSort: true,
        },
        {
          label: 'Redirect(sec)',
          valueField: 'redirect',
          classes: 'text-left',
          isSort: true,
        },
        {
          label: 'Base Page(sec)',
          valueField: 'download',
          classes: 'text-left',
          isSort: true,
        },
        {
          label: 'TTDI(sec)',
          valueField: 'ttdi',
          classes: 'text-left',
          isSort: true,
        },
        {
          label: 'TTDL(sec)',
          valueField: 'ttdl',
          classes: 'text-left',
          isSort: true,
        },
        {
          label: '1st Byte(sec)',
          valueField: 'wait',
          classes: 'text-left',
          isSort: true,
        },
        {
          label: 'First Paint',
          valueField: 'firstpaint',
          classes: 'text-left',
          isSort: true,
        },
        {
          label: 'First Content Paint',
          valueField: 'firstcontentpaint',
          classes: 'text-left',
          isSort: true,
        },
        {
          label: 'Time to Interactive',
          valueField: 'timetointeractive',
          classes: 'text-left',
          isSort: true,
        },
        {
          label: 'First Input Dealy',
          valueField: 'firstinputdelay',
          classes: 'text-left',
          isSort: true,
        }
      ]
    }],
  charts: [
    {
      title: 'Page Performance Trend',
      highchart: {
        chart: {
          type: 'line',
          height: '400px',
        },

        title: {
          text: null
        },


        xAxis: {
          title: {
            text: 'Navigation Start Time'
          },
          type: 'datetime',
          labels: { format: '{value:%e %b\'%y %H:%M}' }
        },
        yAxis: [{
          title: {
            text: 'Performance Metric'
          },
          minorGridLineWidth: 0,
          gridLineWidth: 0,
          alternateGridColor: null
        }, {
          // Primary yAxis
          labels: {
            format: '{value}',
          },
          title: {
            text: 'Page Views',
          },
          opposite: true

        }],
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
        exporting: {
          enabled: true,
          sourceWidth: 1200,
          sourceHeight: 500,
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
  dataLoaded: []
};