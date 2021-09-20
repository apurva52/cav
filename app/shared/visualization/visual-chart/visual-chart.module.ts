import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VisualChartComponent } from './visual-chart.component';
import { ChartModule } from 'src/app/shared/chart/chart.module';

const imports = [
  CommonModule,
  ChartModule
];

const components = [
  VisualChartComponent
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
export class VisualChartModule { }
