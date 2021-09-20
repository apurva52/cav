import { Component, ElementRef, Input, OnInit, ViewChild, AfterViewInit, ViewEncapsulation } from '@angular/core';
import * as Highcharts from 'highcharts';
import { AppError } from 'src/app/core/error/error.model';

import MapModule from 'highcharts/modules/map';
import { MapConfig } from './service/map.model';

MapModule(Highcharts);

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class MapComponent implements AfterViewInit {

  highcharts = Highcharts;

  highchartInstance: Highcharts.Chart;

  @ViewChild('container', { read: ElementRef, static: false })
  container: ElementRef;

  @ViewChild('mapContainer', { read: ElementRef, static: false })
  mapContainer: ElementRef;

  @Input()
  data: MapConfig;
  error: AppError;
  empty: boolean;
  loading: boolean;

  constructor() { }

  ngAfterViewInit(): void {
    const me = this;
    me.render();
  }

  render() {
    const me = this;

    if (me.data) {
      /*  Issue: Multiple isolated components interference
           https://github.com/highcharts/highcharts-angular/issues/84 
   */

      // Disabling the default enabled exporting
      if (me.data.map.exporting == null) {
        me.data.map.exporting = {
          enabled: false
        };
      }

      // Disabling the highchart credits
      me.data.map.credits = {
        enabled: false
      }

      me.highchartInstance = Highcharts.mapChart(
        me.mapContainer.nativeElement,
        me.data.map
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
    this.loading = flag;
  }

  setError(error: AppError) {
    this.error = error;
  }

  setData(mapConfig: MapConfig) {
    this.data = mapConfig;
  }
}
