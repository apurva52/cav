import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HighchartsChartModule } from 'highcharts-angular';
import { MapComponent } from './map.component';



@NgModule({
  declarations: [MapComponent],
  imports: [
    CommonModule,
    HighchartsChartModule,
  ],
  exports: [
    MapComponent
  ]
})
export class MapModule { }
