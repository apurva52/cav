
import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { TabNavigatorService } from '../../services/tab-navigator.service';
import * as Highcharts from 'highcharts';

// declare namespace Highcharts {
//   export interface GlobalOptions {
//     timezone: any;
//   }
// }

@Component({
  selector: 'app-run-command-graphs',
  templateUrl: './run-command-graphs.component.html',
  styleUrls: ['./run-command-graphs.component.css']
})

export class RunCommandGraphs implements OnInit, OnChanges {
  highcharts = Highcharts;
  options: Object;
  chart: any;
  @Input() series = [];
  @Input() chartType: String = 'line';
  @Input() height: String = '100';
  @Input() width: String = '280';
  @Input() xAxis = [];
  @Input() chartComponent = '';
  @Input() updateValue: any;
  chk: any;
  isRedraw = true;
  isShowLegend = true;

  constructor(private _tabNavigator: TabNavigatorService) { }

  /**
   * ngOnInit
   */
  ngOnInit() {
    try {
      this.OptoinConfiguration();
    } catch (error) {
      console.error('error in drawing a charts', error);
    }
  }

  ngOnChanges(changes: any) {
    try {

      if (changes['height'] != undefined) {
        this.height = changes['height']['currentValue'];
      }

      if (changes['width'] != undefined) {
        this.width = changes['width']['currentValue'];
      }

      if (changes['series'] != undefined) {
        this.series = changes['series']['currentValue'];
      }

      if (changes['chartType'] != undefined) {
        this.chartType = changes['chartType']['currentValue'];
      }

      if (changes['chartComponent'] != undefined) {
        this.isShowLegend = false;
      } else {
        this.isShowLegend = true;;
      }

      // option configuration
      this.OptoinConfiguration();

      if (this.chartType == 'pie') {
        this.options['plotOptions'] = {
          pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
              enabled: false
            },
            showInLegend: true
          }
        };
      }

    } catch (error) {
      console.error('exception in ngOnChanges ', error);
    }
  }

  /**saving a chart type */
  saveChart(chart) {
    try {

    } catch (error) {
      console.error('error in saving a chart', error);
    }
  }

  /**
   * plotting a data on the server 
   * */
  OptoinConfiguration() {
    try {
      /*
         * option object in chart will set basic configuration of chart
         * such as height , width , legend and all
         */
      this.options = {
        credits: { enabled: false },
        chart: {
          backgroundColor: 'rgba(0,0,0,0)',
          lineColor: '#CCCCCC',
          tickPixelInterval: 50,
          tickLength: 5,
          tickWidth: 1,
          tickColor: '#FFFFFF',
          tickPosition: 'inside',
          gridLineWidth: 1,
          gridLineColor: '#444444',
          minorTickInterval: null,
          minorTickLength: 2,
          minorTickWidth: 0,
          minorTickColor: '#cccccc',
          minorTickPosition: 'outside',
          minorGridLineWidth: 1,
          minorGridLineColor: '#333333',
          zoomType: 'x',
          height: this.height,
          width: this.width,
          spacing: [10, 0, 10, 7],
          borderColor: '#4572A7',
          plotBorderWidth: 1,
          plotBorderColor: '#CCCCCC',
          plotShadow: true,
        },
        title: {
          text: ''
        },
        xAxis: {
          categories: '',
          type: 'datetime',
          lineWidth: 1,
          tickPixelInterval: 80,
          tickLength: 5,
          tickWidth: 1,
          tickColor: '#FFFFFF',
          tickPosition: 'outside', // 'inside' or 'outside'
          gridLineWidth: 1,
          gridLineColor: '#444444',
          title: {
            style: { fontSize: 14, fontFamily: 'cursive' },
            text: this._tabNavigator.xAxisFieldName,
          }

        },
        yAxis: {
          min: 0,
          allowDecimals: true,
          lineWidth: 1,
          lineColor: '#CCCCCC',
          tickPixelInterval: 50,
          tickLength: 5,
          tickWidth: 1,
          tickColor: '#FFFFFF',
          tickPosition: 'inside',
          gridLineWidth: 1,
          gridLineColor: '#444444',
          minorTickInterval: null,
          minorTickLength: 2,
          minorTickWidth: 0,
          minorTickColor: '#cccccc',
          minorTickPosition: 'outside',
          minorGridLineWidth: 1,
          minorGridLineColor: '#333333',
          title: {
            style: { fontSize: 14, fontFamily: 'cursive' },
            text: this._tabNavigator.yAxisFieldName,
          },
          stackLabels: {
            enabled: false,
            style: {
              fontWeight: 'bold'
            }
          }

        },
        lang: {
          noData: 'Data Not Available',
          loading: 'Data Not Available',
          thousandsSep: ','
        },
        noData: {
          style: {
            fontWeight: 'bold',
            fontSize: '11px',
            color: '#303030'
          }
        },
        legend: {
          align: 'right',
          verticalAlign: 'middle',
          layout: 'vertical', x: 0,
          symbolWidth: 10, symbolHeight: 10,
          symbolRadius: 3,
          itemStyle: { fontSize: 11, fontWeight: 'bold', fontFamily: 'cursive' },
          itemHoverStyle: { color: '#FF0000' },
          padding: 15,
          itemMarginTop: 3,
          margin: 8,
          title: {
            text: this._tabNavigator.basisFieldName,
            style: {
              fontStyle: 'bold',
              fontFamily: 'cursive'
            }
          },
        },
        tooltip: {
          xDateFormat: '%d-%m-%Y %H:%M:%S',
          pointFormat: '{series.name}: {point.y:.2f}'
        },
        plotOptions: {
          series: {
            stacking: '',
            pointWidth: 0,

            lineWidth: 1,
            shadow: true,
            marker: {
              enabled: false,
              symbol: 'circle',
              states: {
                hover: {
                  enabled: true
                }
              }
            },

            states: {
              hover: {
                enabled: true
              }
            }
          },

          pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
              enabled: true,
              format: '<b>{point.name}</b>: {point.percentage:.2f} %'
            }
          }
        },
        // time: {
        //   useUTC: false
        // },
        series: this.series
      };
    } catch (error) {
      console.error('Error in configuration of chart option object can not cast chart Please refresh widow ', error);
    }
  }

}
