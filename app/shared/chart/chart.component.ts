import {
  Component,
  ViewEncapsulation,
  AfterViewInit,
  ElementRef,
  ViewChild,
  Input,
} from '@angular/core';

import { ChartConfig } from './service/chart.model';
import { AppError } from 'src/app/core/error/error.model';

import * as Highcharts from 'highcharts';
import More from 'highcharts/highcharts-more';

import MapModule from 'highcharts/modules/map';

import Funnel from 'highcharts/modules/funnel';
import Sankey from 'highcharts/modules/sankey';

import HC_exporting from 'highcharts/modules/exporting';

More(Highcharts);
MapModule(Highcharts);
Funnel(Highcharts);
Sankey(Highcharts);
HC_exporting(Highcharts);

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ChartComponent implements AfterViewInit {
  highcharts = Highcharts;

  highchartInstance: Highcharts.Chart;

  @ViewChild('container', { read: ElementRef, static: false })
  container: ElementRef;

  @ViewChild('chartContainer', { read: ElementRef, static: false })
  chartContainer: ElementRef;

  @Input()
  data: ChartConfig;
  error: AppError;
  empty: boolean;

  @Input() set loading(value: boolean) {
    this.toggleLoadingData(value);
  }

  constructor() { }

  @Input()
  set setChart(data: ChartConfig) {
    this.data = data;
    this.render();
  }

  ngAfterViewInit(): void {
    const me = this;
    me.render();
  }

  render() {
    const me = this;


    if (me.data && me.chartContainer) {
      /*  Issue: Multiple isolated components interference
              https://github.com/highcharts/highcharts-angular/issues/84 
      */

      // Disabling the default enabled exporting
      if (me.data.highchart.exporting == null) {
        me.data.highchart.exporting = {
          enabled: false
        };
      }

      // Disabling the highchart credits
      me.data.highchart.credits = {
        enabled: false
      }

      me.highchartInstance = Highcharts.chart(
        me.chartContainer.nativeElement,
        me.data.highchart
      );
    }
  }

  chartInstanceCreated(chart: Highcharts.Chart) {
    const me = this;
    me.highchartInstance = chart;
  }

  toggleEmptyData(flag: boolean) {
    this.empty = flag;
  }

  toggleLoadingData(flag: boolean) {
    // ISSUE: this will work only when chart has rendered
    if (this.highchartInstance) {
      if (flag) {
        this.highchartInstance.showLoading();
      } else {
        this.highchartInstance.hideLoading();
      }
    } else {
      console.error("Chart hasn't rendered yet. Loader won't work.")
    }
  }

  setError(error: AppError) {
    this.error = error;
  }

  setData(chartConfig: ChartConfig) {
    this.data = chartConfig;
  }
}
