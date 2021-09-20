import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { AppError } from 'src/app/core/error/error.model';
import { ChartConfig } from 'src/app/shared/chart/service/chart.model';
import { SEQ_DIAGRAM_DATA } from './service/sequence-diagram.dummy';
import { SeqData, SequenceDiagramData } from './service/sequence-diagram.model';
import * as Highcharts from 'highcharts';
import more from 'highcharts/highcharts-more';
import { NgIf } from '@angular/common';

more(Highcharts);

(function (H) {
  H.seriesType(
    'flame',
    'columnrange',
    {
      cursor: 'pointer',
      dataLabels: {
        enabled: true,
        format: '{point.name}',
        inside: true,
        align: 'center',
        crop: true,
        overflow: 'none',
        color: 'black',
        style: {
          textOutline: 'none',
          fontWeight: 'normal',
        },
      },
      point: {
        events: {
          click: function () {
            var point = this,
              chart = point.series.chart,
              series = point.series,
              xAxis = series.xAxis,
              yAxis = series.yAxis;

            xAxis.setExtremes(xAxis.min, point.x, false);
            yAxis.setExtremes(point.low, point.high, false);

            chart.showResetZoom();
            chart.redraw();
          },
        },
      },
      pointPadding: 0,
      groupPadding: 0,
    },
    {}
  ) as Highcharts.Series;
})(Highcharts);
@Component({
  selector: 'app-sequence-diagram',
  templateUrl: './sequence-diagram.component.html',
  styleUrls: ['./sequence-diagram.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SequenceDiagramComponent implements OnInit {
  loading: boolean;
  empty: boolean;
  error: AppError;
  data: SequenceDiagramData;
  chartConfigData: ChartConfig;

  highcharts = Highcharts;

  @ViewChild('graphContainer', { read: ElementRef,static: false })
  graphContainer: ElementRef

  constructor() { }

  // widgets height and width
  get containerDimensions(): { width: number; height: number } {
    return {
      width: this.graphContainer.nativeElement.offsetWidth,
      height: this.graphContainer.nativeElement.offsetHeight,
    };
  }

  ngOnInit(): void {
    const me = this;
    me.data = SEQ_DIAGRAM_DATA;
    me.getChartData(me.data.seqData);

    if(me.data){
      console.log(me.graphContainer);
      }
    
  }

  private getChartData(data: SeqData[]) {
    const me = this;
    
    me.chartConfigData = {
      highchart: {
        chart: {
          type: 'flame',
          inverted: false,
        },
        title: {
          text: null,
        },
        legend: {
          enabled: false,
        },
        credits: {
          enabled: false
        },
        xAxis: [
          {
            visible: false,
          },
          {
            visible: false,
            startOnTick: false,
            endOnTick: false,
            minPadding: 0,
            maxPadding: 0,
          },
        ],
        yAxis: [
          {
            visible: false,
          },
          {
            visible: false,
            min: 0,
            maxPadding: 0,
            startOnTick: false,
            endOnTick: false,
          },
        ],
        series: [
          {
            data: data,
          },
        ] as Highcharts.SeriesColumnrangeOptions[],
      },
    };
  }
}
