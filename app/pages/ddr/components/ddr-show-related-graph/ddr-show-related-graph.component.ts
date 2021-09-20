import { Component, OnInit, Input } from '@angular/core';
// import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs';
// import { ChartModule } from 'angular2-highcharts';
// import { NgGridConfig, NgGridItemConfig, NgGridItemEvent } from '../../../../../interfaces/INgGrid';
import * as moment from 'moment';
import 'moment-timezone';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-ddr-show-related-graph',
  templateUrl: './ddr-show-related-graph.component.html',
  styleUrls: ['./ddr-show-related-graph.component.css']
})
export class DdrShowRelatedGraphComponent implements OnInit {
  highcharts = Highcharts;
  chart: Object;
  options: Object;
  @Input('graphValue') graphValue;
  @Input('json') json;
  constructor() { }

  ngOnInit() {
    console.log('value-------', this.graphValue)
    console.log('json value', this.json);
    this.createChart();
  }

  createChart() {
    var jsonObj = this.json;
    var graphVal = this.graphValue;
    var jsonVal = [ jsonObj.edRelatedGraphData[graphVal['grapghIndex']] ];
    console.log('zone--', this.json['timeZone'], jsonVal);

    this.options = {
      chart: {
        type: 'spline',
        height: 170,
        width: 420,
        responsive: true,
        zoomType: 'x'
      },
      credits: {
        enabled: false
      },
      title: {
        text: this.graphValue['graphName'],
        style: { fontSize: '12px' }
      },
      tooltip: {
        tooltip: {
          formatter: function () {
            return '<b>Time: </b>' + moment.tz(this.x, jsonObj['timeZone']).format('MM/DD/YY HH:mm:ss') +
              '<br/ ><b>Value: ' + '</b>' + this.y;
          }
        },
      },
      legend: {
        itemStyle: {
          color: 'rgb(29, 181, 18)',
          fontWeight: 'bold',
          fontSize: '9px'
        },
        itemHoverStyle: {
          color: 'rgb(29, 220, 20)'
        },
        itemDistance: 5,
        padding: 0,
        margin: 0,
        labelFormatter: function () {
          let index = (this.name).indexOf('-');
          if (index !== -1) {
            return (this.name).substring(0, index) + '<br/>' + (this.name).substring(index, (this.name).length);
          } else {
            return this.name;
          }
        },
        enabled: false
      },
      yAxis: {
        title: {
          text: ''
        },
        min: 0
      },
      xAxis: {
        type: 'time',
        labels: {
          formatter: function () {
            return moment.tz(this.value, jsonObj['timeZone']).format('HH:mm:ss') ;
          },
          style: {
            fontSize: '8px'
          }
        },
       plotBands: [{ // mark the flopath duration #81F822
                 color: '#e4f9a6',
                 from: jsonObj.startTime,
                 to: jsonObj.endTime
             }]
      },
      series: jsonVal
    };
  }
  saveChart(chartInstance) {
    this.chart = chartInstance;
  }
}
