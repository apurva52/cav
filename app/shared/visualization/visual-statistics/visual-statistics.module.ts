import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VisualStatisticsComponent } from './visual-statistics.component';
import { TableModule, CardModule, TooltipModule, InputTextModule } from 'primeng';


const imports = [
  CommonModule,
  TableModule,
  CardModule,
  TooltipModule,
  InputTextModule
];

const components = [
  VisualStatisticsComponent
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
export class VisualStatisticsModule { }
