import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScatterMapComponent } from './scatter-map.component';
import {
  ButtonModule,
  TooltipModule,
  CardModule,
  DropdownModule,
  InputTextModule,
} from 'primeng';
import { FormsModule } from '@angular/forms';
import { ChartModule } from '../chart/chart.module';

const imports = [
  CommonModule,
  ButtonModule,
  TooltipModule,
  CardModule,
  DropdownModule,
  FormsModule,
  InputTextModule,
  ChartModule
];
const components = [ScatterMapComponent];

@NgModule({
  declarations: [components],
  imports: [imports],
  exports: [components],
})
export class ScatterMapModule {}
