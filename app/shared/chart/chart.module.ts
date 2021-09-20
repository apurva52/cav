import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartComponent } from './chart.component';
import { HighchartsChartModule } from 'highcharts-angular';
import { ButtonModule, TooltipModule } from 'primeng';
import { ChartMenuModule } from './chart-menu/chart-menu.module';

const imports = [
  CommonModule,
  HighchartsChartModule,
  TooltipModule,
  ButtonModule,
  ChartMenuModule
];

const components = [
  ChartComponent,
];

@NgModule({
  declarations: [components],
  imports: [
    imports
  ],
  exports: [
    components
  ]
})
export class ChartModule { }
